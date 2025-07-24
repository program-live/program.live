"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Trash2, Edit, Plus } from "lucide-react"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"

function SponsorForm({ sponsor = null, onSave, onCancel }: { 
  sponsor?: any, 
  onSave: () => void, 
  onCancel: () => void 
}) {
  const [formData, setFormData] = useState({
    name: sponsor?.name || "",
    logoUrl: sponsor?.logoUrl || "",
    linkUrl: sponsor?.linkUrl || "",
    displayText: sponsor?.displayText || "",
    displayOrder: sponsor?.displayOrder || 1,
    isActive: sponsor?.isActive ?? true,
    paddingClass: sponsor?.paddingClass || "px-[30px]"
  })
  
  const createSponsor = useMutation(api.sponsors.createSponsor)
  const updateSponsor = useMutation(api.sponsors.updateSponsor)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      if (sponsor) {
        await updateSponsor({
          id: sponsor._id,
          ...formData
        })
      } else {
        await createSponsor(formData)
      }
      onSave()
    } catch (error) {
      console.error("Failed to save sponsor:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{sponsor ? "Edit Sponsor" : "Add New Sponsor"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Sponsor Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="linkUrl">Link URL *</Label>
            <Input
              id="linkUrl"
              type="url"
              value={formData.linkUrl}
              onChange={(e) => setFormData(prev => ({ ...prev, linkUrl: e.target.value }))}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="logoUrl">Logo URL (optional)</Label>
            <Input
              id="logoUrl"
              type="url"
              value={formData.logoUrl}
              onChange={(e) => setFormData(prev => ({ ...prev, logoUrl: e.target.value }))}
              placeholder="Leave empty to use display text"
            />
          </div>
          
          <div>
            <Label htmlFor="displayText">Display Text (if no logo)</Label>
            <Input
              id="displayText"
              value={formData.displayText}
              onChange={(e) => setFormData(prev => ({ ...prev, displayText: e.target.value }))}
              placeholder="Text to show if no logo provided"
            />
          </div>
          
          <div>
            <Label htmlFor="displayOrder">Display Order</Label>
            <Input
              id="displayOrder"
              type="number"
              min="1"
              value={formData.displayOrder}
              onChange={(e) => setFormData(prev => ({ ...prev, displayOrder: parseInt(e.target.value) }))}
            />
          </div>
          
          <div>
            <Label htmlFor="paddingClass">Padding Class</Label>
            <Input
              id="paddingClass"
              value={formData.paddingClass}
              onChange={(e) => setFormData(prev => ({ ...prev, paddingClass: e.target.value }))}
              placeholder="e.g., px-[30px] or px-[15px] sm:px-[30px]"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
            />
            <Label htmlFor="isActive">Active</Label>
          </div>
          
          <div className="flex space-x-2">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : (sponsor ? "Update" : "Create")}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

function AdminDashboard() {
  const currentStatus = useQuery(api.streamStatus.getCurrentStatus)
  const sponsors = useQuery(api.sponsors.getAllSponsors)
  
  const updateStatus = useMutation(api.streamStatus.updateStatus)
  const toggleSponsorStatus = useMutation(api.sponsors.toggleSponsorStatus)
  const deleteSponsor = useMutation(api.sponsors.deleteSponsor)
  
  const [isToggling, setIsToggling] = useState(false)
  const [editingSponsor, setEditingSponsor] = useState<any>(null)
  const [showAddForm, setShowAddForm] = useState(false)

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

  const handleToggleSponsor = async (sponsorId: string, isActive: boolean) => {
    try {
      await toggleSponsorStatus({ id: sponsorId as any, isActive })
    } catch (error) {
      console.error("Failed to toggle sponsor status:", error)
    }
  }

  const handleDeleteSponsor = async (sponsorId: string) => {
    if (confirm("Are you sure you want to delete this sponsor?")) {
      try {
        await deleteSponsor({ id: sponsorId as any })
      } catch (error) {
        console.error("Failed to delete sponsor:", error)
      }
    }
  }

  const handleFormSave = () => {
    setEditingSponsor(null)
    setShowAddForm(false)
  }

  if (currentStatus === undefined || sponsors === undefined) {
    return (
      <div className="min-h-screen bg-custom-dark-gray flex items-center justify-center">
        <p className="text-white">Loading...</p>
      </div>
    )
  }

  if (editingSponsor || showAddForm) {
    return (
      <div className="min-h-screen bg-custom-dark-gray p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-8">Admin Dashboard</h1>
          <SponsorForm
            sponsor={editingSponsor}
            onSave={handleFormSave}
            onCancel={handleFormSave}
          />
        </div>
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
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Sponsor Management</CardTitle>
              <CardDescription>Manage sponsors that appear on the homepage</CardDescription>
            </div>
            <Button onClick={() => setShowAddForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Sponsor
            </Button>
          </CardHeader>
          <CardContent>
            {sponsors.length === 0 ? (
              <p className="text-gray-400">No sponsors yet. Add your first sponsor!</p>
            ) : (
              <div className="space-y-4">
                {sponsors.map((sponsor) => (
                  <div key={sponsor._id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h3 className="font-medium">{sponsor.name}</h3>
                        <Badge variant={sponsor.isActive ? "default" : "secondary"}>
                          {sponsor.isActive ? "Active" : "Inactive"}
                        </Badge>
                        <Badge variant="outline">Order: {sponsor.displayOrder}</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {sponsor.linkUrl}
                      </p>
                      {sponsor.displayText && (
                        <p className="text-sm text-gray-500">
                          Display: "{sponsor.displayText}"
                        </p>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={sponsor.isActive}
                        onCheckedChange={(checked) => handleToggleSponsor(sponsor._id, checked)}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingSponsor(sponsor)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteSponsor(sponsor._id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
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