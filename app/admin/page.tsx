"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"

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
      <div className="min-h-screen bg-custom-dark-gray flex items-center justify-center">
        <p className="text-white">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-custom-dark-gray p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Admin Dashboard</h1>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Livestream Status</CardTitle>
            <CardDescription>
              Toggle your stream status to let viewers know when you're live
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="stream-status"
                checked={currentStatus.isLive}
                onCheckedChange={handleStatusToggle}
                disabled={isToggling}
              />
              <Label htmlFor="stream-status" className="text-sm font-medium">
                {currentStatus.isLive ? (
                  <span className="text-green-600">🔴 Live</span>
                ) : (
                  <span className="text-gray-600">⚫ Offline</span>
                )}
              </Label>
            </div>
            {isToggling && (
              <p className="text-sm text-gray-500">Updating status...</p>
            )}
            <div className="text-sm text-gray-600">
              <p>
                Last updated:{" "}
                {new Date(currentStatus.timestamp).toLocaleString()}
              </p>
              {currentStatus.isLive && currentStatus.startedAt && (
                <p>
                  Stream started:{" "}
                  {new Date(currentStatus.startedAt).toLocaleString()}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>More Admin Features</CardTitle>
            <CardDescription>Additional features coming soon...</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-400">Future admin functionality will be added here.</p>
          </CardContent>
        </Card>
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
    <div className="min-h-screen bg-custom-dark-gray flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Admin Access</CardTitle>
          <CardDescription>Enter the admin password to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Authenticating..." : "Access Admin"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 