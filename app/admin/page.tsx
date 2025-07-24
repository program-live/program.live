"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { cn } from "@/lib/utils"
import { TriangleRightIcon } from "@radix-ui/react-icons"

function AdminDashboard() {
  const currentStatus = useQuery(api.streamStatus.getCurrentStatus)
  const currentStreamInfo = useQuery(api.streamInfo.getCurrentInfo)
  const updateStatus = useMutation(api.streamStatus.updateStatus)
  const updateStreamInfo = useMutation(api.streamInfo.updateInfo)
  const clearStreamInfo = useMutation(api.streamInfo.clearInfo)
  const [isToggling, setIsToggling] = useState(false)
  const [isUpdatingInfo, setIsUpdatingInfo] = useState(false)
  const [streamTitle, setStreamTitle] = useState("")
  const [streamDescription, setStreamDescription] = useState("")

  const handleStatusToggle = async (isLive: boolean) => {
    setIsToggling(true)
    try {
      await updateStatus({ isLive })
    } catch (error) {
      console.error("Failed to update stream status:", error)
    } finally {
      setIsToggling(false)
    }
  }

  const handleUpdateStreamInfo = async () => {
    setIsUpdatingInfo(true)
    try {
      await updateStreamInfo({
        title: streamTitle.trim() || undefined,
        description: streamDescription.trim() || undefined,
      })
      setStreamTitle("")
      setStreamDescription("")
    } catch (error) {
      console.error("Failed to update stream info:", error)
    } finally {
      setIsUpdatingInfo(false)
    }
  }

  const handleClearStreamInfo = async () => {
    setIsUpdatingInfo(true)
    try {
      await clearStreamInfo()
      setStreamTitle("")
      setStreamDescription("")
    } catch (error) {
      console.error("Failed to clear stream info:", error)
    } finally {
      setIsUpdatingInfo(false)
    }
  }

  if (currentStatus === undefined || currentStreamInfo === undefined) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-foreground">Loading...</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-background p-15">
      <div className="flex flex-col gap-15 relative max-w-lg mx-auto w-full">
        <h1 className="font-extrabold text-15 text-center">Admin Dashboard</h1>

        <div className="flex flex-col gap-15 border-l pl-15">
          <div className="flex items-center gap-x-5">
            <Switch
              id="stream-status"
              checked={currentStatus.isLive}
              onCheckedChange={handleStatusToggle}
              disabled={isToggling}
            />
            <label htmlFor="stream-status" className={cn(isToggling && "opacity-70")}>
              {currentStatus.isLive ? "Live" : "Offline"}
            </label>
          </div>

          <table className="text-sm text-muted-foreground" cellPadding="0" cellSpacing="0">
            <tbody>
              <tr>
                <td className="pr-10 flex-1">Stream started:{"\u0020"}</td>
                <td className="pr-10 flex-1">
                  {(currentStatus.isLive && currentStatus.startedAt) ? (
                    new Date(currentStatus.startedAt).toLocaleString().replace(',', '')
                  ) : (
                    "—"
                  )}
                </td>
              </tr>
              <tr>
                <td className="pr-10 flex-1">Last updated:{"\u0020"}</td>
                <td className="pr-10 flex-1">{new Date(currentStatus.timestamp).toLocaleString().replace(',', '')}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-15 border-l pl-15">
          <div className="space-y-10">
            <div className="space-y-5">
              <label htmlFor="stream-title">
                Stream Title
              </label>
              <Input
                id="stream-title"
                placeholder="Leave empty for placeholder"
                value={streamTitle}
                onChange={(e) => setStreamTitle(e.target.value)}
                disabled={isUpdatingInfo}
              />
            </div>

            <div className="space-y-5">
              <label htmlFor="stream-description">
                Stream Description
              </label>
              <Textarea
                id="stream-description"
                placeholder="Leave empty for placeholder"
                value={streamDescription}
                onChange={(e) => setStreamDescription(e.target.value)}
                disabled={isUpdatingInfo}
                rows={3}
              />
            </div>

            <div className="flex gap-5">
              <Button 
                onClick={handleUpdateStreamInfo}
                disabled={isUpdatingInfo}
                className="w-full"
              >
                {isUpdatingInfo ? "Updating..." : "Update Info"}
              </Button>
              <Button 
                onClick={handleClearStreamInfo}
                disabled={isUpdatingInfo}
                variant="outline"
              >
                Clear Info
              </Button>
            </div>
          </div>

          <table className="text-muted-foreground" cellPadding="0" cellSpacing="0">
            <tbody>
              <tr>
                <td className="pr-10 flex-1">Title:{"\u0020"}</td>
                <td className="pr-10 flex-1">
                  {currentStreamInfo.title || "—"}
                </td>
              </tr>
              <tr>
                <td className="pr-10 flex-1">Description:{"\u0020"}</td>
                <td className="pr-10 flex-1">
                  {currentStreamInfo.description || "—"}
                </td>
              </tr>
              <tr>
                <td className="pr-10 flex-1">Last updated:{"\u0020"}</td>
                <td className="pr-10 flex-1">{new Date(currentStreamInfo.timestamp).toLocaleString().replace(',', '')}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-5">
          <h2>YouTube Preview</h2>
          <div 
            className="relative flex w-full overflow-hidden flex-shrink-0" 
            style={{ aspectRatio: '16/9' }}
          >
            <iframe
              className="absolute top-0 left-0 w-full h-full"
              src="https://www.youtube.com/embed/live_stream?channel=UCbEmN5Nw2p6yFsaak0sHPpg"
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
          </div>
        </div>
      </div>

    </div>
  )
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      })

      if (response.ok) {
        setIsAuthenticated(true)
        setPassword("")
      } else {
        setError("Invalid password")
      }
    } catch (error) {
      setError("Authentication failed")
    } finally {
      setIsLoading(false)
    }
  }

  if (isAuthenticated) {
    return <AdminDashboard />
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center uppercase">
      <div className="w-full max-w-sm p-15 space-y-5">
        <div className="space-y-5">
          <h1 className="text-15 font-extrabold">Admin Access</h1>
          <p className="text-muted-foreground">Enter the admin password to continue</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-10">
          <div>
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              autoFocus
              required
            />
          </div>
          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}
          <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
            {isLoading ? "Authenticating..." : "Enter"}
            <TriangleRightIcon className="size-12" />
          </Button>
        </form>
      </div>
    </div>
  )
} 