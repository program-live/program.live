"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { cn } from "@/lib/utils"
import { TriangleRightIcon } from "@radix-ui/react-icons"

function AdminDashboard() {
  const currentStatus = useQuery(api.streamStatus.getCurrentStatus)
  const updateStatus = useMutation(api.streamStatus.updateStatus)
  const [isToggling, setIsToggling] = useState(false)

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

  if (currentStatus === undefined) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-foreground">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background px-15 pt-25 pb-15 max-w-3xl mx-auto">
      <div className="relative border-[0.5px]">
        <h1 className="font-extrabold bg-background px-5 absolute -top-[7px] text-[15px] left-10">
          Admin Dashboard
        </h1>

        <div className="p-15 space-y-15">
          <div>
            <h2 className="font-extrabold">Livestream Status</h2>
            <p className="text-muted-foreground">Toggle your stream status to let viewers know when you're live.</p>
          </div>

          <div className="space-y-15">
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
                  <td className="pr-10">Stream started:{"\u0020"}</td>
                  <td className="pr-10">
                    {(currentStatus.isLive && currentStatus.startedAt) ? (
                      new Date(currentStatus.startedAt).toLocaleString().replace(',', '')
                    ) : (
                      "—"
                    )}
                  </td>
                </tr>
                <tr>
                  <td className="pr-10">Last updated:{"\u0020"}</td>
                  <td className="pr-10">{new Date(currentStatus.timestamp).toLocaleString().replace(',', '')}</td>
                </tr>
              </tbody>
            </table>

            <div className="space-y-5">
              <h3>YouTube Preview</h3>

              <div 
                className="relative flex w-full overflow-hidden flex-shrink-0" 
                style={{ aspectRatio: '16/9' }}
              >
                <iframe
                  className="w-full h-full"
                  src="https://www.youtube.com/embed/live_stream?channel=UCbEmN5Nw2p6yFsaak0sHPpg"
                  allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                />
              </div>
            </div>
          </div>
        </div>

        <hr className="border-t-[0.5px]" />

        <div className="p-15 space-y-15">
          <div>
            <h2 className="font-extrabold">Other Admin Features</h2>
            <p className="text-muted-foreground">Future admin functionality will be added here.</p>
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