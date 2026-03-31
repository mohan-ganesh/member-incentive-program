import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { ArrowLeft } from 'lucide-react';

export function AdminCreateEmployerGroup() {
  const navigate = useNavigate();
  const { dispatch } = useApp();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    industry: '',
    contactEmail: '',
  });

  function handleCreate() {
    if (!formData.name) return;
    dispatch({
      type: 'CREATE_EMPLOYER_GROUP',
      group: {
        name: formData.name,
        description: formData.description,
        industry: formData.industry,
        contactEmail: formData.contactEmail,
        isActive: true,
      },
    });
    
    navigate('/admin/employer-groups');
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate('/admin/employer-groups')} className="text-zinc-500 hover:text-zinc-900">
          <ArrowLeft className="h-5 w-5 mr-1" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Create Employer Group</h1>
          <p className="text-zinc-500">Define a new B2B client that uses the platform.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Group Information</CardTitle>
          <CardDescription>Basic details about the employer group.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="eg-name">Group Name *</Label>
            <Input
              id="eg-name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Acme Corporation"
            />
          </div>
          <div>
            <Label htmlFor="eg-desc">Description</Label>
            <Textarea
              id="eg-desc"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief description of the employer group..."
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="eg-industry">Industry</Label>
              <Input
                id="eg-industry"
                value={formData.industry}
                onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                placeholder="e.g., Technology"
              />
            </div>
            <div>
              <Label htmlFor="eg-contact">Contact Email</Label>
              <Input
                id="eg-contact"
                type="email"
                value={formData.contactEmail}
                onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                placeholder="hr@company.com"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3 pb-8">
        <Button variant="outline" onClick={() => navigate('/admin/employer-groups')}>
          Cancel
        </Button>
        <Button onClick={handleCreate} disabled={!formData.name}>
          Create Group
        </Button>
      </div>
    </div>
  );
}
