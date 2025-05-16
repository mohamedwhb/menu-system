"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { PlusIcon, SearchIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import AddUserDialog from "@/components/dashboard/settings/add-user-dialog"
import ResetPasswordDialog from "@/components/dashboard/settings/reset-password-dialog"

// Sample user data
const initialUsers = [
  { id: 1, name: "Max Mustermann", email: "max@example.com", role: "Admin", active: true },
  { id: 2, name: "Anna Schmidt", email: "anna@example.com", role: "Manager", active: true },
  { id: 3, name: "Thomas Huber", email: "thomas@example.com", role: "Mitarbeiter", active: true },
  { id: 4, name: "Lisa Maier", email: "lisa@example.com", role: "Mitarbeiter", active: false },
]

export default function UserManagementTab() {
  const [users, setUsers] = useState(initialUsers)
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddUserOpen, setIsAddUserOpen] = useState(false)
  const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<any>(null)

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddUser = (newUser: any) => {
    setUsers([...users, { ...newUser, id: users.length + 1, active: true }])
    setIsAddUserOpen(false)
  }

  const handleResetPassword = (userId: number) => {
    const user = users.find((u) => u.id === userId)
    setSelectedUser(user)
    setIsResetPasswordOpen(true)
  }

  const handleToggleActive = (userId: number) => {
    setUsers(users.map((user) => (user.id === userId ? { ...user, active: !user.active } : user)))
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle>Benutzerverwaltung</CardTitle>
              <CardDescription>Verwalten Sie die Benutzer Ihres Restaurants.</CardDescription>
            </div>
            <Button onClick={() => setIsAddUserOpen(true)}>
              <PlusIcon className="mr-2 h-4 w-4" />
              Neuen Benutzer hinzufügen
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="relative">
              <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Suchen..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>E-Mail</TableHead>
                    <TableHead>Rolle</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Aktionen</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center">
                        Keine Benutzer gefunden.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.role}</TableCell>
                        <TableCell>
                          <Badge variant={user.active ? "default" : "secondary"}>
                            {user.active ? "Aktiv" : "Inaktiv"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="sm" onClick={() => handleResetPassword(user.id)}>
                              Passwort zurücksetzen
                            </Button>
                            <Button
                              variant={user.active ? "destructive" : "default"}
                              size="sm"
                              onClick={() => handleToggleActive(user.id)}
                            >
                              {user.active ? "Deaktivieren" : "Aktivieren"}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>

      <AddUserDialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen} onAddUser={handleAddUser} />

      <ResetPasswordDialog open={isResetPasswordOpen} onOpenChange={setIsResetPasswordOpen} user={selectedUser} />
    </div>
  )
}
