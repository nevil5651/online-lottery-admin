// RoleEditDialog.tsx
import React, { useState } from 'react';
import { 
  CircularProgress
} from '@mui/material';
import { DialogTitle,
  DialogActions,BaseDialog as Dialog, Button, 
  TextField, DialogContent } from '../../../components/ui';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { rolePermissions, type Role } from '../../../auth/roles';
import type { Admin } from '../types';
import { updateAdminRole } from '../services/adminService';

interface RoleEditDialogProps {
  admin: Admin;
  onClose: () => void;
  onRoleUpdate: (updatedAdmin: Admin) => void;
}

const validationSchema = Yup.object({
  role: Yup.string().required('Role is required')
});

export const RoleEditDialog: React.FC<RoleEditDialogProps> = ({
  admin,
  onClose,
  onRoleUpdate
}) => {
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (values: { role: Role }) => {
    setSubmitting(true);
    try {
      // You may need to replace 'actorId' with the actual actor's id variable from your context or props
      const updatedAdmin = await updateAdminRole(admin.id, values.role, /* actorId */ '');
      onRoleUpdate(updatedAdmin);
      onClose();
    } catch (error) {
      console.error('Role update failed:', error);
    } finally {
      setSubmitting(false);
    }
  };

  

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        Edit Role for {admin.name}
      </DialogTitle>
      
      <Formik
        initialValues={{ role: admin.role }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched }) => (
          <Form>
            <DialogContent>
              <Field
                as={TextField}
                select
                fullWidth
                name="role"
                label="Admin Role"
                SelectProps={{ native: true }}
                error={touched.role && !!errors.role}
                helperText={touched.role && errors.role}
              >
                {Object.keys(rolePermissions).map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </Field>
            </DialogContent>
            
            <DialogActions>
              <Button onClick={onClose} disabled={submitting}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                variant="contained" 
                color="primary"
                disabled={submitting}
              >
                {submitting ? <CircularProgress size={24} /> : 'Save Changes'}
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};