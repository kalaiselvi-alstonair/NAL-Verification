import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertContactSchema } from "../../../shared/schema";
import { MapPin, Phone, Mail, Clock, PhoneCall, MessageCircle } from "lucide-react";
import { z } from "zod";

const contactFormSchema = insertContactSchema.extend({
  serviceInterest: z.string().min(1, "Please select a service")
});

type ContactForm = z.infer<typeof contactFormSchema>;

export default function Contact() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch
  } = useForm<ContactForm>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      company: "",
      serviceInterest: "",
      message: ""
    }
  });

  const contactMutation = useMutation({
    mutationFn: async (data: ContactForm) => {
      return apiRequest("POST", "/api/contact", data);
    },
    onSuccess: () => {
      toast({
        title: "Message sent successfully!",
        description: "We'll get back to you within 24 hours.",
      });
      reset();
      setIsSubmitting(false);
    },
    onError: (error) => {
      toast({
        title: "Error sending message",
        description: error.message,
        variant: "destructive",
      });
      setIsSubmitting(false);
    },
  });

  const onSubmit = (data: ContactForm) => {
    setIsSubmitting(true);
    contactMutation.mutate(data);
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: "Address",
      details: "123 Tech Park, Whitefield\nBangalore, Karnataka 560066"
    },
    {
      icon: Phone,
      title: "Phone",
      details: "+91 80 1234 5678\n+91 80 8765 4321"
    },
    {
      icon: Mail,
      title: "Email",
      details: "info@nalindia.com\nsupport@nalindia.com"
    },
    {
      icon: Clock,
      title: "Business Hours",
      details: "Mon - Fri: 9:00 AM - 6:00 PM\nSat: 9:00 AM - 1:00 PM"
    }
  ];

  const faqs = [
    {
      question: "How long does the verification process take?",
      answer: "Our automated process typically takes 15-20 minutes to complete a full property verification, depending on the complexity and government portal response times."
    },
    {
      question: "Which states do you support?",
      answer: "We currently support Karnataka, Tamil Nadu, Telangana, and Andhra Pradesh, with plans to expand to more states soon."
    },
    {
      question: "Is my data secure?",
      answer: "Yes, we use enterprise-grade security measures including end-to-end encryption, secure credential management, and GDPR-compliant data handling practices."
    },
    {
      question: "What if documents are not found?",
      answer: "If documents are not available in government portals, we provide a detailed report explaining the missing documents and suggest alternative verification methods."
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Contact Header */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">Contact Us</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Ready to revolutionize your property verification process? Get in touch with our team.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <Card className="bg-blue-light">
              <CardContent className="p-8">
                <h2 className="text-2xl font-semibold text-main mb-6">Get Started Today</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div>
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      {...register("fullName")}
                      placeholder="Enter your full name"
                      className="mt-2"
                    />
                    {errors.fullName && (
                      <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      {...register("email")}
                      placeholder="Enter your email"
                      className="mt-2"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      {...register("phone")}
                      placeholder="Enter your phone number"
                      className="mt-2"
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="company">Company</Label>
                    <Input
                      id="company"
                      {...register("company")}
                      placeholder="Enter your company name"
                      className="mt-2"
                    />
                    {errors.company && (
                      <p className="text-red-500 text-sm mt-1">{errors.company.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="serviceInterest">Service Interest</Label>
                    <Select onValueChange={(value) => setValue("serviceInterest", value)}>
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select a service" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="property-verification">Property Verification</SelectItem>
                        <SelectItem value="document-retrieval">Document Retrieval</SelectItem>
                        <SelectItem value="ai-analysis">AI Analysis</SelectItem>
                        <SelectItem value="enterprise-solution">Enterprise Solution</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.serviceInterest && (
                      <p className="text-red-500 text-sm mt-1">{errors.serviceInterest.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      {...register("message")}
                      placeholder="Tell us about your requirements"
                      rows={4}
                      className="mt-2"
                    />
                    {errors.message && (
                      <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>
                    )}
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </CardContent>
            </Card>
            
            {/* Contact Information */}
            <Card className="bg-mint-light">
              <CardContent className="p-8">
                <h2 className="text-2xl font-semibold text-main mb-6">Contact Information</h2>
                <div className="space-y-6">
                  {contactInfo.map((info, index) => (
                    <div key={index} className="flex items-start">
                      <div className="bg-primary text-white w-10 h-10 rounded-full flex items-center justify-center mr-4">
                        <info.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-primary">{info.title}</h3>
                        <p className="text-gray-600 whitespace-pre-line">{info.details}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Map */}
            <div className="bg-gray-200 rounded-xl h-64 flex items-center justify-center">
              <img
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400"
                alt="Office location map"
                className="rounded-xl w-full h-full object-cover"
              />
            </div>
            
            {/* Support */}
            <Card className="bg-primary text-white">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">24/7 Support</h3>
                <p className="mb-4">Need immediate assistance? Our support team is available round the clock.</p>
                <div className="flex space-x-4">
                  <Button variant="secondary" className="bg-white text-primary hover:bg-gray-100">
                    <PhoneCall className="h-4 w-4 mr-2" />
                    Call Now
                  </Button>
                  <Button variant="secondary" className="bg-white text-primary hover:bg-gray-100">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Live Chat
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      {/* FAQ Section */}
      <section className="py-20 bg-accent">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600">Quick answers to common questions about our services.</p>
          </div>
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <Card key={index} className={index % 2 === 0 ? "bg-blue-light" : "bg-purple-light"}>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-main mb-2">{faq.question}</h3>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
