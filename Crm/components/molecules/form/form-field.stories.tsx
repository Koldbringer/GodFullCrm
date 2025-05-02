import type { Meta, StoryObj } from '@storybook/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { FormField } from './form-field';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  bio: z.string().optional(),
  role: z.string().min(1, { message: 'Please select a role.' }),
  notifications: z.boolean().default(false),
  active: z.boolean().default(true),
});

type FormValues = z.infer<typeof formSchema>;

const meta = {
  title: 'Molecules/Form/FormField',
  component: FormField,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="w-full max-w-md p-6 border rounded-lg shadow-sm">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof FormField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TextInput: Story = {
  render: () => {
    const form = useForm<FormValues>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        name: '',
        email: '',
        bio: '',
        role: '',
        notifications: false,
        active: true,
      },
    });

    const onSubmit = (data: FormValues) => {
      console.log(data);
    };

    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            form={form}
            name="name"
            label="Name"
            placeholder="Enter your name"
            required
            tooltip="Your full name as it appears on your ID"
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    );
  },
};

export const EmailInput: Story = {
  render: () => {
    const form = useForm<FormValues>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        name: '',
        email: '',
        bio: '',
        role: '',
        notifications: false,
        active: true,
      },
    });

    const onSubmit = (data: FormValues) => {
      console.log(data);
    };

    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            form={form}
            name="email"
            label="Email"
            type="email"
            placeholder="Enter your email"
            required
            description="We'll never share your email with anyone else."
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    );
  },
};

export const TextareaInput: Story = {
  render: () => {
    const form = useForm<FormValues>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        name: '',
        email: '',
        bio: '',
        role: '',
        notifications: false,
        active: true,
      },
    });

    const onSubmit = (data: FormValues) => {
      console.log(data);
    };

    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            form={form}
            name="bio"
            label="Bio"
            type="textarea"
            placeholder="Tell us about yourself"
            description="Keep it brief and to the point."
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    );
  },
};

export const SelectInput: Story = {
  render: () => {
    const form = useForm<FormValues>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        name: '',
        email: '',
        bio: '',
        role: '',
        notifications: false,
        active: true,
      },
    });

    const onSubmit = (data: FormValues) => {
      console.log(data);
    };

    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            form={form}
            name="role"
            label="Role"
            type="select"
            placeholder="Select a role"
            required
            options={[
              { label: 'Admin', value: 'admin' },
              { label: 'User', value: 'user' },
              { label: 'Guest', value: 'guest' },
            ]}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    );
  },
};

export const CheckboxInput: Story = {
  render: () => {
    const form = useForm<FormValues>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        name: '',
        email: '',
        bio: '',
        role: '',
        notifications: false,
        active: true,
      },
    });

    const onSubmit = (data: FormValues) => {
      console.log(data);
    };

    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            form={form}
            name="notifications"
            label="Receive notifications"
            type="checkbox"
            description="We'll send you updates about our product."
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    );
  },
};

export const SwitchInput: Story = {
  render: () => {
    const form = useForm<FormValues>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        name: '',
        email: '',
        bio: '',
        role: '',
        notifications: false,
        active: true,
      },
    });

    const onSubmit = (data: FormValues) => {
      console.log(data);
    };

    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            form={form}
            name="active"
            label="Active status"
            type="switch"
            description="Toggle to activate or deactivate your account."
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    );
  },
};

export const CompleteForm: Story = {
  render: () => {
    const form = useForm<FormValues>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        name: '',
        email: '',
        bio: '',
        role: '',
        notifications: false,
        active: true,
      },
    });

    const onSubmit = (data: FormValues) => {
      console.log(data);
    };

    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            form={form}
            name="name"
            label="Name"
            placeholder="Enter your name"
            required
            tooltip="Your full name as it appears on your ID"
          />
          <FormField
            form={form}
            name="email"
            label="Email"
            type="email"
            placeholder="Enter your email"
            required
            description="We'll never share your email with anyone else."
          />
          <FormField
            form={form}
            name="bio"
            label="Bio"
            type="textarea"
            placeholder="Tell us about yourself"
            description="Keep it brief and to the point."
          />
          <FormField
            form={form}
            name="role"
            label="Role"
            type="select"
            placeholder="Select a role"
            required
            options={[
              { label: 'Admin', value: 'admin' },
              { label: 'User', value: 'user' },
              { label: 'Guest', value: 'guest' },
            ]}
          />
          <div className="flex flex-col gap-4">
            <FormField
              form={form}
              name="notifications"
              label="Receive notifications"
              type="checkbox"
              description="We'll send you updates about our product."
            />
            <FormField
              form={form}
              name="active"
              label="Active status"
              type="switch"
              description="Toggle to activate or deactivate your account."
            />
          </div>
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    );
  },
};
