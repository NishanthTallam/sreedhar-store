"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronRight, MapPin, Phone, Mail, Clock } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  subject: z.string().min(3, "Subject must be at least 3 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export default function ContactUsPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to submit");

      alert("Success! Your enquiry has been submitted. We will get back to you soon!");
      reset();
    } catch (error) {
      alert("Error: Failed to submit your enquiry. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <nav className="mb-8 flex items-center text-sm text-neutral-500">
        <Link href="/" className="hover:text-brand-600">Home</Link>
        <ChevronRight className="mx-2 h-4 w-4" />
        <span className="text-neutral-900 font-medium">Contact Us</span>
      </nav>

      <div className="mb-12">
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">Get in Touch</h1>
        <p className="mt-2 text-lg text-neutral-600">We'd love to hear from you. Please fill out this form or use our contact details.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Contact Information & Map */}
        <div className="lg:col-span-1 space-y-8">
          <div className="rounded-2xl bg-white p-6 shadow-sm border border-neutral-200 space-y-6">
            <h3 className="text-xl font-bold text-neutral-900">Sreedhar Store</h3>
            
            <div className="flex items-start gap-4">
              <MapPin className="h-6 w-6 text-brand-600 shrink-0 mt-1" />
              <div>
                <p className="font-medium text-neutral-900">Address</p>
                <p className="text-neutral-600">Bukkapatnam,<br/>Puttaparthi,<br/>Andhra Pradesh</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Phone className="h-6 w-6 text-brand-600 shrink-0 mt-1" />
              <div className="space-y-1">
                <p className="font-medium text-neutral-900">Phone & WhatsApp</p>
                <p>
                  <a href="tel:+917989102722" className="text-brand-600 hover:underline">+91 7989102722</a>
                </p>
                <p>
                  <a href="https://wa.me/917989102722" className="text-brand-600 hover:underline" target="_blank" rel="noopener noreferrer">Chat on WhatsApp</a>
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Mail className="h-6 w-6 text-brand-600 shrink-0 mt-1" />
              <div>
                <p className="font-medium text-neutral-900">Email</p>
                <a href="mailto:tallamnishanth@gmail.com" className="text-brand-600 hover:underline">tallamnishanth@gmail.com</a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Clock className="h-6 w-6 text-brand-600 shrink-0 mt-1" />
              <div>
                <p className="font-medium text-neutral-900">Working Hours</p>
                <p className="text-neutral-600">Monday - Saturday: 9:00 AM - 8:00 PM</p>
                <p className="text-neutral-600">Sunday: 9:00 AM - 2:00 PM</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden shadow-sm border border-neutral-200 h-64 relative bg-neutral-100">
            {/* Embedded Google Map */}
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15442.274020942361!2d77.7813959!3d14.3364403!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bb1604a11f2679b%3A0xe9db0f589c3757db!2sBukkapatnam%2C%20Andhra%20Pradesh!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen={false} 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="Store Location"
            ></iframe>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2">
          <div className="rounded-2xl bg-white p-6 sm:p-8 shadow-sm border border-neutral-200">
            <h2 className="text-2xl font-bold text-neutral-900 mb-6">Send us a message</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium text-neutral-900">Full Name</label>
                  <Input id="name" placeholder="John Doe" {...register("name")} />
                  {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-neutral-900">Email Address</label>
                  <Input id="email" type="email" placeholder="john@example.com" {...register("email")} />
                  {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="phone" className="text-sm font-medium text-neutral-900">Phone Number</label>
                  <Input id="phone" type="tel" placeholder="+91 9876543210" {...register("phone")} />
                  {errors.phone && <p className="text-sm text-red-500">{errors.phone.message}</p>}
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="subject" className="text-sm font-medium text-neutral-900">Subject</label>
                  <Input id="subject" placeholder="How can we help?" {...register("subject")} />
                  {errors.subject && <p className="text-sm text-red-500">{errors.subject.message}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium text-neutral-900">Message</label>
                <Textarea 
                  id="message" 
                  placeholder="Tell us more about your enquiry..." 
                  className="min-h-[150px] resize-y"
                  {...register("message")} 
                />
                {errors.message && <p className="text-sm text-red-500">{errors.message.message}</p>}
              </div>

              <Button type="submit" className="w-full sm:w-auto" size="lg" disabled={isSubmitting}>
                {isSubmitting ? "Sending..." : "Submit Message"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
