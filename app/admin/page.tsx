"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Trash, Pencil, Plus, ArrowLeft, ImageIcon } from "lucide-react"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { cn } from "@/lib/utils"
import { TriangleRightIcon } from "@radix-ui/react-icons"

function SponsorForm({ sponsor = null, onSave, onCancel }: { 
  sponsor?: any, 
  onSave: () => void, 
  onCancel: () => void 
}) {
  const [formData, setFormData] = useState({
    placement: sponsor?.placement || "card",
    name: sponsor?.name || "",
    logoUrl: sponsor?.logoUrl || "",
    linkUrl: sponsor?.linkUrl || "",
    displayText: sponsor?.displayText || "",
    displayOrder: sponsor?.displayOrder || 1,
    isActive: sponsor?.isActive ?? true
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
    <div className="flex flex-col gap-15">
      <div className="relative flex items-center gap-10">
        <Button variant="ghost" size="icon" onClick={onCancel}>
          <ArrowLeft className="w-25 h-25" />
        </Button>
        <h1 className="absolute left-1/2 -translate-x-1/2 text-15 font-extrabold">{sponsor ? "Edit Sponsor" : "Add New Sponsor"}</h1>
      </div>
      <form onSubmit={handleSubmit} className="space-y-10">
        <div>
          <Label htmlFor="placement">Placement<span className="text-destructive align-super">*</span></Label>
          <select
            id="placement"
            value={formData.placement}
            onChange={(e) => setFormData(prev => ({ ...prev, placement: e.target.value as "card" | "banner" }))}
            className="flex h-20 w-full border border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            required
          >
            <option value="card">Card (Stream Section)</option>
            <option value="banner">Banner (Footer)</option>
          </select>
        </div>
        
        <div>
          <Label htmlFor="name">Sponsor Name<span className="text-destructive align-super">*</span></Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            required
          />
        </div>
        
        <div>
          <Label htmlFor="linkUrl">Link URL<span className="text-destructive align-super">*</span></Label>
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
          <Label htmlFor="displayText">Display Text<span className="text-destructive align-super">*</span></Label>
          <Input
            id="displayText"
            value={formData.displayText}
            onChange={(e) => setFormData(prev => ({ ...prev, displayText: e.target.value }))}
            placeholder="Alt text for logos or primary display text"
            required
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
        
        {/* Padding Class field removed */}
        
        <div className="flex items-center space-x-10 py-10">
          <Switch
            id="isActive"
            checked={formData.isActive}
            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
          />
          <Label htmlFor="isActive">Active</Label>
        </div>
        
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Saving..." : (sponsor ? "Update" : "Create")}
        </Button>
      </form>
    </div>
  )
}

function AdminDashboard() {
  const currentStatus = useQuery(api.streamStatus.getCurrentStatus)
  const currentStreamInfo = useQuery(api.streamInfo.getCurrentInfo)
  const sponsors = useQuery(api.sponsors.getAllSponsors)
  
  const updateStatus = useMutation(api.streamStatus.updateStatus)
  const updateStreamInfo = useMutation(api.streamInfo.updateInfo)
  const clearStreamInfo = useMutation(api.streamInfo.clearInfo)
  const toggleSponsorStatus = useMutation(api.sponsors.toggleSponsorStatus)
  const deleteSponsor = useMutation(api.sponsors.deleteSponsor)
  
  const [isToggling, setIsToggling] = useState(false)
  const [isUpdatingInfo, setIsUpdatingInfo] = useState(false)
  const [streamTitle, setStreamTitle] = useState("")
  const [streamDescription, setStreamDescription] = useState("")  
  const [editingSponsor, setEditingSponsor] = useState<any>(null)
  const [showAddForm, setShowAddForm] = useState(false)

  // Populate fields with current stream info when data loads
  useEffect(() => {
    if (currentStreamInfo) {
      setStreamTitle(currentStreamInfo.title || "")
      setStreamDescription(currentStreamInfo.description || "")
    }
  }, [currentStreamInfo])

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

  if (currentStatus === undefined || currentStreamInfo === undefined || sponsors === undefined) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-foreground">Loading...</p>
      </div>
    )
  }

  if (editingSponsor || showAddForm) {
    return (
      <div className="min-h-screen bg-custom-dark-gray p-15">
        <div className="max-w-lg mx-auto">
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
    <div className="flex flex-col min-h-screen bg-background p-15">
      <div className="flex flex-col gap-15 relative max-w-lg mx-auto w-full">
        <h1 className="font-extrabold text-15 text-center">Admin Dashb0ard</h1>

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

          <table className="text-muted-foreground w-fit" cellPadding="0" cellSpacing="0">
            <tbody>
              <tr>
                <td className="pr-15 w-80">Started:</td>
                <td>
                  {(currentStatus.isLive && currentStatus.startedAt) ? (
                    new Date(currentStatus.startedAt).toLocaleString().replace(',', '')
                  ) : (
                    "—"
                  )}
                </td>
              </tr>
              <tr>
                <td className="pr-15 w-80">Updated:</td>
                <td>{new Date(currentStatus.timestamp).toLocaleString().replace(',', '')}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-15 border-l pl-15">
          <div className="space-y-15">
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
                {isUpdatingInfo ? "Updating..." : "Update"}
              </Button>
              <Button 
                onClick={handleClearStreamInfo}
                disabled={isUpdatingInfo}
                variant="outline"
              >
                Clear
              </Button>
            </div>
          </div>

          <table className="text-muted-foreground w-fit" cellPadding="0" cellSpacing="0">
            <tbody>
              <tr>
                <td className="pr-15 w-80">Title:</td>
                <td>
                  {currentStreamInfo?.title || "—"}
                </td>
              </tr>
              <tr>
                <td className="pr-15 w-80">Description:</td>
                <td>
                  {currentStreamInfo?.description || "—"}
                </td>
              </tr>
              <tr>
                <td className="pr-15 w-80">Updated:</td>
                <td>
                  {currentStreamInfo?.timestamp 
                    ? new Date(currentStreamInfo?.timestamp).toLocaleString().replace(',', '')
                    : "—"
                  }
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-15 border-l pl-15">
          <h2>Sp0nsors</h2>

          {sponsors.sort((a, b) => a.displayOrder - b.displayOrder).map((sponsor, i) => (
            <div key={sponsor._id} className="flex gap-15">
              <p>{i + 1}.</p>
              <div className="flex justify-between gap-15 w-full">
                <div className="flex-1">
                  <div className="flex items-center gap-5">
                    <h3 className="font-medium">{sponsor.name}</h3>
                  </div>
                  <table className="text-muted-foreground" cellPadding="0" cellSpacing="0">
                    <tbody>
                      <tr>
                        <td className="pr-15 w-80">Placement:</td>
                        <td>{sponsor.placement}</td>
                      </tr>
                      <tr>
                        <td className="pr-15 w-80">URL:</td>
                        <td>{sponsor.linkUrl}</td>
                      </tr>
                      <tr>
                        <td className="pr-15 w-80">Logo URL:</td>
                        <td>{sponsor.logoUrl || "—"}</td>
                      </tr>
                      <tr>
                        <td className="pr-15 w-80">Order:</td>
                        <td>{sponsor.displayOrder}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="flex space-x-10">
                  <div className="flex space-x-5">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteSponsor(sponsor._id)}
                    >
                      <Trash />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setEditingSponsor(sponsor)}
                    >
                      <Pencil />
                    </Button>
                  </div>
                  <Switch
                    checked={sponsor.isActive}
                    onCheckedChange={(checked) => handleToggleSponsor(sponsor._id, checked)}
                  />
                </div>
              </div>
            </div>
          ))}

          <Button onClick={() => setShowAddForm(true)}>
            <Plus />
          </Button>
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