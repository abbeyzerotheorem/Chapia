/**
 * Onboarding Page for WhatsApp Sales AI
 * Multi-step business setup wizard
 */
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
  MessageCircle,
  Building2,
  Globe,
  Palette,
  Check,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Sparkles,
  Bot,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useToast } from "@/components/ui/use-toast"

const businessInfoSchema = z.object({
  businessName: z.string().min(2, "Business name is required"),
  industry: z.string().min(1, "Please select an industry"),
  description: z.string().max(500, "Description too long").optional(),
})

const localizationSchema = z.object({
  country: z.string().min(1, "Please select your country"),
  currency: z.string().min(1, "Please select your currency"),
  timezone: z.string().min(1, "Please select your timezone"),
})

const customizationSchema = z.object({
  primaryColor: z.string().optional(),
  aiPersonality: z.string().min(1, "Please select an AI personality"),
  language: z.string().min(1, "Please select a language"),
})

type BusinessInfoValues = z.infer<typeof businessInfoSchema>
type LocalizationValues = z.infer<typeof localizationSchema>
type CustomizationValues = z.infer<typeof customizationSchema>

const industries = [
  { value: "RETAIL", label: "Retail" },
  { value: "WHOLESALE", label: "Wholesale" },
  { value: "SERVICES", label: "Services" },
  { value: "MANUFACTURING", label: "Manufacturing" },
  { value: "AGRICULTURE", label: "Agriculture" },
  { value: "TOBACCO", label: "Tobacco" },
  { value: "OTHER", label: "Other" },
]

const countries = [
  { value: "NG", label: "Nigeria" },
  { value: "KE", label: "Kenya" },
  { value: "GH", label: "Ghana" },
  { value: "ZA", label: "South Africa" },
  { value: "UG", label: "Uganda" },
  { value: "TZ", label: "Tanzania" },
]

const currencies = [
  { value: "NGN", label: "₦ Naira (NGN)" },
  { value: "KES", label: "KSh Shilling (KES)" },
  { value: "GHS", label: "₵ Cedi (GHS)" },
  { value: "ZAR", label: "R Rand (ZAR)" },
  { value: "UGX", label: "UGX Shilling (UGX)" },
  { value: "TZS", label: "TSH Shilling (TZS)" },
]

const timezones = [
  { value: "Africa/Lagos", label: "West Africa Time (UTC+1)" },
  { value: "Africa/Nairobi", label: "East Africa Time (UTC+3)" },
  { value: "Africa/Accra", label: "Greenwich Mean Time (UTC+0)" },
  { value: "Africa/Johannesburg", label: "South Africa Time (UTC+2)" },
  { value: "Africa/Kampala", label: "East Africa Time (UTC+3)" },
  { value: "Africa/Dar_es_Salaam", label: "East Africa Time (UTC+3)" },
]

const aiPersonalities = [
  { value: "professional", label: "Professional", desc: "Formal and business-like" },
  { value: "friendly", label: "Friendly", desc: "Warm and approachable" },
  { value: "casual", label: "Casual", desc: "Relaxed and conversational" },
  { value: "enthusiastic", label: "Enthusiastic", desc: "Energetic and positive" },
]

const languages = [
  { value: "en", label: "English" },
  { value: "fr", label: "French" },
  { value: "pt", label: "Portuguese" },
  { value: "sw", label: "Swahili" },
  { value: "ha", label: "Hausa" },
  { value: "yo", label: "Yoruba" },
  { value: "ig", label: "Igbo" },
  { value: "am", label: "Amharic" },
]

const colorOptions = [
  { value: "blue", label: "Ocean Blue", class: "bg-blue-500" },
  { value: "green", label: "Savanna Green", class: "bg-green-500" },
  { value: "purple", label: "Royal Purple", class: "bg-purple-500" },
  { value: "orange", label: "Sunset Orange", class: "bg-orange-500" },
  { value: "teal", label: "African Teal", class: "bg-teal-500" },
  { value: "rose", label: "Desert Rose", class: "bg-rose-500" },
]

type Step = {
  id: string
  title: string
  description: string
  icon: typeof Building2
}

const steps: Step[] = [
  { id: "business", title: "Business Info", description: "Tell us about your business", icon: Building2 },
  { id: "localization", title: "Localization", description: "Set your region preferences", icon: Globe },
  { id: "customization", title: "Customize", description: "Make it yours", icon: Palette },
]

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [completed, setCompleted] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const businessForm = useForm<BusinessInfoValues>({
    resolver: zodResolver(businessInfoSchema),
    defaultValues: { businessName: "", industry: "", description: "" },
  })

  const localizationForm = useForm<LocalizationValues>({
    resolver: zodResolver(localizationSchema),
    defaultValues: { country: "NG", currency: "NGN", timezone: "Africa/Lagos" },
  })

  const customizationForm = useForm<CustomizationValues>({
    resolver: zodResolver(customizationSchema),
    defaultValues: { primaryColor: "blue", aiPersonality: "friendly", language: "en" },
  })

  async function handleNext() {
    if (currentStep === 0) {
      const valid = await businessForm.trigger()
      if (!valid) return
    } else if (currentStep === 1) {
      const valid = await localizationForm.trigger()
      if (!valid) return
    }
    if (currentStep < steps.length - 1) setCurrentStep(currentStep + 1)
  }

  function handleBack() {
    if (currentStep > 0) setCurrentStep(currentStep - 1)
  }

  async function handleComplete() {
    const valid = await customizationForm.trigger()
    if (!valid) return
    setIsSubmitting(true)
    try {
      const data = { ...businessForm.getValues(), ...localizationForm.getValues(), ...customizationForm.getValues() }
      const response = await fetch("/api/business/onboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!response.ok) throw new Error("Failed to complete setup")
      setCompleted(true)
      toast({ title: "Welcome aboard! 🎉", description: "Your business is set up. Let's start selling!" })
      setTimeout(() => router.push("/dashboard"), 2000)
    } catch (error) {
      toast({ title: "Something went wrong", description: "Please try again or contact support.", variant: "destructive" })
    } finally {
      setIsSubmitting(false)
    }
  }

  const progress = ((currentStep + 1) / steps.length) * 100

  if (completed) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-emerald-100 dark:from-gray-950 dark:to-gray-900 flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center border-green-200 dark:border-green-800 shadow-xl">
          <CardHeader>
            <div className="mx-auto w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
              <Check className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <CardTitle className="text-2xl">All Set! 🎉</CardTitle>
            <CardDescription className="text-base">
              Your business is ready to go. We&apos;re redirecting you to your dashboard...
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center">
              <Loader2 className="w-6 h-6 animate-spin text-green-600 dark:text-green-400" />
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 dark:from-gray-950 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 mb-2">
            <Bot className="w-7 h-7 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome to Chapia</h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            Let&apos;s get your business set up in just a few steps. You can always change these later.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground px-1">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center gap-1.5">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-medium transition-colors ${
                    index <= currentStep
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {index < currentStep ? <Check className="w-3 h-3" /> : index + 1}
                </div>
                <span className="hidden sm:inline">{step.title}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <Card className="border-primary/10 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {(() => {
                const StepIcon = steps[currentStep].icon
                return <StepIcon className="w-5 h-5 text-primary" />
              })()}
              {steps[currentStep].title}
            </CardTitle>
            <CardDescription>{steps[currentStep].description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Step 0: Business Info */}
            {currentStep === 0 && (
              <Form {...businessForm}>
                <div className="space-y-4">
                  <FormField
                    control={businessForm.control}
                    name="businessName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Business Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Mama Fatima's Goods" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={businessForm.control}
                    name="industry"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Industry</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select your industry" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {industries.map((ind) => (
                              <SelectItem key={ind.value} value={ind.value}>
                                {ind.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={businessForm.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description (optional)</FormLabel>
                        <FormControl>
                          <textarea
                            className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder="Tell us a bit about what you sell..."
                            {...field}
                          />
                        </FormControl>
                        <FormDescription className="text-xs">
                          {field.value?.length || 0}/500 characters
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </Form>
            )}

            {/* Step 1: Localization */}
            {currentStep === 1 && (
              <Form {...localizationForm}>
                <div className="space-y-4">
                  <FormField
                    control={localizationForm.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select your country" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {countries.map((c) => (
                              <SelectItem key={c.value} value={c.value}>
                                {c.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={localizationForm.control}
                    name="currency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Currency</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select your currency" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {currencies.map((c) => (
                              <SelectItem key={c.value} value={c.value}>
                                {c.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={localizationForm.control}
                    name="timezone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Timezone</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select your timezone" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {timezones.map((t) => (
                              <SelectItem key={t.value} value={t.value}>
                                {t.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </Form>
            )}

            {/* Step 2: Customization */}
            {currentStep === 2 && (
              <Form {...customizationForm}>
                <div className="space-y-6">
                  {/* Color Selection */}
                  <FormField
                    control={customizationForm.control}
                    name="primaryColor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Theme Color</FormLabel>
                        <FormControl>
                          <div className="flex flex-wrap gap-3">
                            {colorOptions.map((color) => (
                              <button
                                key={color.value}
                                type="button"
                                onClick={() => field.onChange(color.value)}
                                className={`w-10 h-10 rounded-full ${color.class} ring-2 ring-offset-2 transition-all ${
                                  field.value === color.value
                                    ? "ring-primary scale-110"
                                    : "ring-transparent hover:scale-105"
                                }`}
                                title={color.label}
                              />
                            ))}
                          </div>
                        </FormControl>
                        <FormDescription>Choose a primary color for your dashboard</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* AI Personality Selection */}
                  <FormField
                    control={customizationForm.control}
                    name="aiPersonality"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>AI Personality</FormLabel>
                        <FormControl>
                          <div className="grid grid-cols-2 gap-3">
                            {aiPersonalities.map((p) => (
                              <button
                                key={p.value}
                                type="button"
                                onClick={() => field.onChange(p.value)}
                                className={`p-3 rounded-lg border text-left transition-all ${
                                  field.value === p.value
                                    ? "border-primary bg-primary/5 ring-1 ring-primary"
                                    : "border-input hover:border-primary/50 hover:bg-muted/50"
                                }`}
                              >
                                <div className="font-medium text-sm">{p.label}</div>
                                <div className="text-xs text-muted-foreground mt-0.5">{p.desc}</div>
                              </button>
                            ))}
                          </div>
                        </FormControl>
                        <FormDescription>
                          This sets the tone for how your AI assistant talks to customers
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Language Selection */}
                  <FormField
                    control={customizationForm.control}
                    name="language"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Default Language</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select language" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {languages.map((l) => (
                              <SelectItem key={l.value} value={l.value}>
                                {l.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Primary language for your dashboard and customer communications
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </Form>
            )}
          </CardContent>
          {/* Navigation Buttons */}
          <div className="flex items-center justify-between border-t p-6">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 0 || isSubmitting}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            {currentStep < steps.length - 1 ? (
              <Button onClick={handleNext} className="gap-2">
                Continue
                <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                onClick={handleComplete}
                disabled={isSubmitting}
                className="gap-2 bg-green-600 hover:bg-green-700"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Setting up...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Complete Setup
                  </>
                )}
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}

