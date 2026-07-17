"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  Calendar as CalendarIcon,
  Clock,
  User as UserIcon,
  FileText,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  AlertTriangle,
  Info,
  Check
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { calculateEndTime, checkOverlap, isTimeSlotPast, timeToMinutes, toLocalDateString } from "@/lib/booking-utils";

interface PricingOption {
  id: string;
  duration: string;
  price: number;
  label: string;
  description: string | null;
}

interface OperatingHour {
  id: string;
  dayOfWeek: number;
  openTime: string;
  closeTime: string;
  isOpen: boolean;
}

interface Settings {
  id: string;
  studioName: string;
  hourlyRate: number;
}

interface BookingFormProps {
  pricing: PricingOption[];
  operatingHours: OperatingHour[];
  settings: Settings;
}

interface OccupiedSlot {
  id: string;
  startTime: string;
  endTime: string;
  duration: string;
  status: string;
}

export default function BookingFormClient({ pricing, operatingHours, settings }: BookingFormProps) {
  const { data: session } = useSession();
  const [step, setStep] = useState(1);

  // Booking states
  const [selectedDate, setSelectedDate] = useState<Date>(() => new Date("2000-01-01T00:00:00.000Z"));
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedDuration, setSelectedDuration] = useState("Lite");
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [notes, setNotes] = useState("");

  // Live occupied slots from API
  const [occupiedSlots, setOccupiedSlots] = useState<OccupiedSlot[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingReference, setBookingReference] = useState("");

  // Calendar states
  const [currentMonth, setCurrentMonth] = useState<Date>(() => new Date("2000-01-01T00:00:00.000Z"));
  const [isHydrated, setIsHydrated] = useState(false);
  const [now, setNow] = useState<Date>(() => new Date("2000-01-01T00:00:00.000Z"));

  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    setSelectedDate(today);
    setCurrentMonth(today);
    setNow(new Date());
    setIsHydrated(true);
  }, []);

  // Auto-fill user details if logged in
  useEffect(() => {
    if (session?.user) {
      setCustomerName(session.user.name || "");
      setCustomerEmail(session.user.email || "");
      // Fetch user profile info for phone if needed
      fetch("/api/auth/session")
        .then((res) => res.json())
        .then((data) => {
          if (data?.user?.phone) setCustomerPhone(data.user.phone);
        })
        .catch(() => {});
    }
  }, [session]);

  // Fetch occupied slots for selected date
  useEffect(() => {
    const fetchSlots = async () => {
      setIsLoadingSlots(true);
      setSelectedTime(""); // Reset time selection on date change
      try {
        const dateStr = toLocalDateString(selectedDate);
        const res = await fetch(`/api/bookings?date=${dateStr}`);
        if (res.ok) {
          const data = await res.json();
          setOccupiedSlots(data);
        }
      } catch (err) {
        console.error("Error fetching slots:", err);
      } finally {
        setIsLoadingSlots(false);
      }
    };
    fetchSlots();
  }, [selectedDate]);

  // Day of week operating hours
  const dayOfWeek = selectedDate.getDay();
  const dayOpHours = operatingHours.find((h) => h.dayOfWeek === dayOfWeek);
  const isStudioOpen = dayOpHours ? dayOpHours.isOpen : false;

  // Calculate pricing option match
  const selectedPriceOption = pricing.find((p) => p.duration === selectedDuration);
  const totalPrice = selectedPriceOption ? selectedPriceOption.price : 0;
  const formatPackagePrice = (price: number) => `${Math.round(price / 1000)}K`;
  const formatDisplayDate = (value: Date) =>
    new Intl.DateTimeFormat("en-GB", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "Asia/Jakarta",
    }).format(value);
  const formatCompactDate = (value: Date) =>
    new Intl.DateTimeFormat("en-GB", {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "Asia/Jakarta",
    }).format(value);

  // End time calculation
  const calculatedEndTime = selectedTime ? calculateEndTime(selectedTime, selectedDuration) : "";

  // Check if slot overrides or overlaps
  const durationOverlap = (() => {
    if (!selectedTime || !calculatedEndTime || !isStudioOpen) return false;
    
    // Check if end time exceeds studio close hours
    const closeMin = timeToMinutes(dayOpHours!.closeTime);
    const endMin = timeToMinutes(calculatedEndTime);
    if (endMin > closeMin) {
      return "EXCEEDS_CLOSE";
    }

    // Check if overlaps with existing booked slots
    const hasOverlap = checkOverlap(selectedTime, calculatedEndTime, occupiedSlots);
    if (hasOverlap) {
      return "OVERLAP";
    }

    return false;
  })();

  // Generate hourly slots to choose from (10:00 AM to 9:00 PM)
  const timeSlots = (() => {
    if (!isStudioOpen || !dayOpHours) return [];
    
    const slots = [];
    const openMin = timeToMinutes(dayOpHours.openTime);
    const closeMin = timeToMinutes(dayOpHours.closeTime);
    
    // Create hourly intervals
    for (let min = openMin; min < closeMin; min += 60) {
      const timeStr = `${Math.floor(min / 60).toString().padStart(2, "0")}:${(min % 60).toString().padStart(2, "0")}`;
      slots.push(timeStr);
    }
    
    return slots;
  })();

  // Check if slot has already passed today
  const isSlotPast = (timeStr: string) => {
    const currentTime = isHydrated ? now : new Date();
    return isTimeSlotPast(selectedDate, timeStr, currentTime);
  };

  // Check if slot is occupied
  const isSlotOccupied = (timeStr: string) => {
    const slotMin = timeToMinutes(timeStr);
    
    return occupiedSlots.some((booking) => {
      const startMin = timeToMinutes(booking.startTime);
      const endMin = timeToMinutes(booking.endTime);
      return slotMin >= startMin && slotMin < endMin;
    });
  };

  // Submit Booking
  const handleConfirmBooking = async () => {
    setIsSubmitting(true);
    setBookingError(null);

    try {
      const dateStr = toLocalDateString(selectedDate);
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName,
          customerEmail,
          customerPhone,
          notes,
          date: dateStr,
          startTime: selectedTime,
          duration: selectedDuration,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setBookingError(data.error || "Failed to create booking.");
        setIsSubmitting(false);
      } else {
        setBookingReference(data.referenceNumber);
        setIsSubmitting(false);
        setStep(5); // Success step
      }
    } catch (err) {
      setBookingError("An unexpected network error occurred.");
      setIsSubmitting(false);
    }
  };

  // Calendar Helpers
  const changeMonth = (val: number) => {
    const nextMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + val, 1);
    setCurrentMonth(nextMonth);
  };

  const generateDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    const firstDayIndex = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();

    const days = [];
    
    // Padding for previous month days
    for (let i = 0; i < firstDayIndex; i++) {
      days.push(null);
    }

    // Current month days
    for (let d = 1; d <= totalDays; d++) {
      days.push(new Date(year, month, d));
    }

    return days;
  };

  const calendarDays = generateDays();
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  return (
    <div className="bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-850 rounded-3xl p-6 sm:p-10 shadow-sm transition-colors max-w-4xl mx-auto">
      {/* Steps Indicator */}
      {step < 5 && (
        <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-6 mb-8 text-xs font-semibold tracking-wider text-neutral-400">
          <div className={`flex items-center space-x-1 ${step >= 1 ? "text-neutral-900 dark:text-white" : ""}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step > 1 ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-950" : "border border-neutral-300 dark:border-neutral-700"}`}>
              {step > 1 ? <Check size={10} /> : "1"}
            </span>
            <span className="hidden sm:inline">DATE & TIME</span>
          </div>
          <div className="h-px bg-neutral-250 dark:bg-neutral-800 w-8 sm:w-16"></div>
          <div className={`flex items-center space-x-1 ${step >= 2 ? "text-neutral-900 dark:text-white" : ""}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step > 2 ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-950" : "border border-neutral-300 dark:border-neutral-700"}`}>
              {step > 2 ? <Check size={10} /> : "2"}
            </span>
            <span className="hidden sm:inline">PACKAGE</span>
          </div>
          <div className="h-px bg-neutral-250 dark:bg-neutral-800 w-8 sm:w-16"></div>
          <div className={`flex items-center space-x-1 ${step >= 3 ? "text-neutral-900 dark:text-white" : ""}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step > 3 ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-950" : "border border-neutral-300 dark:border-neutral-700"}`}>
              {step > 3 ? <Check size={10} /> : "3"}
            </span>
            <span className="hidden sm:inline">YOUR INFO</span>
          </div>
          <div className="h-px bg-neutral-250 dark:bg-neutral-800 w-8 sm:w-16"></div>
          <div className={`flex items-center space-x-1 ${step >= 4 ? "text-neutral-900 dark:text-white" : ""}`}>
            <span className="w-5 h-5 rounded-full border border-neutral-300 dark:border-neutral-700 flex items-center justify-center text-[10px]">4</span>
            <span className="hidden sm:inline">REVIEW</span>
          </div>
        </div>
      )}

      {/* Booking Wizard Steps Container */}
      <div>
        <AnimatePresence mode="wait">
          
          {/* STEP 1: Select Date & Time */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-10"
            >
              {/* Left Column: Calendar */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-500 flex items-center space-x-2">
                  <CalendarIcon size={16} />
                  <span>1. Select Date</span>
                </h3>
                
                <div className="bg-white dark:bg-neutral-950 p-4 border border-neutral-100 dark:border-neutral-900 rounded-2xl">
                  {/* Calendar Month Header */}
                  <div className="flex justify-between items-center mb-4">
                    <button
                      onClick={() => changeMonth(-1)}
                      className="p-1 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-900"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <span className="text-sm font-medium tracking-wide">
                      {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                    </span>
                    <button
                      onClick={() => changeMonth(1)}
                      className="p-1 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-900"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>

                  {/* Calendar Grid Days */}
                  <div className="grid grid-cols-7 gap-2 text-center text-xs font-semibold text-neutral-450 dark:text-neutral-500 mb-2">
                    <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
                  </div>

                  <div className="grid grid-cols-7 gap-1">
                    {calendarDays.map((day, idx) => {
                      if (!day) return <div key={idx}></div>;
                      
                      const dayStr = day.toISOString().split("T")[0];
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      const isPast = day.getTime() < today.getTime();
                      const isSelected = selectedDate.toDateString() === day.toDateString();

                      return (
                        <button
                          key={idx}
                          disabled={isPast}
                          onClick={() => setSelectedDate(day)}
                          className={`aspect-square rounded-lg flex items-center justify-center text-xs font-medium transition-colors ${
                            isSelected
                              ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 font-bold"
                              : isPast
                              ? "text-neutral-300 dark:text-neutral-700 cursor-not-allowed"
                              : "hover:bg-neutral-150 dark:hover:bg-neutral-900 text-neutral-700 dark:text-neutral-300"
                          }`}
                        >
                          {day.getDate()}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10px] text-neutral-400 dark:text-neutral-500 px-1">
                  <span>Selected Date: <strong className="text-neutral-900 dark:text-white">{formatDisplayDate(selectedDate)}</strong></span>
                </div>
              </div>

              {/* Right Column: Time Slots */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-500 flex items-center space-x-2">
                  <Clock size={16} />
                  <span>2. Select Time</span>
                </h3>

                {!isStudioOpen ? (
                  <div className="p-8 bg-neutral-100 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-900 rounded-2xl text-center space-y-2">
                    <p className="text-sm font-medium text-neutral-550 dark:text-neutral-400">Studio is Closed</p>
                    <p className="text-xs text-neutral-400 font-light">We are closed on this day. Please select another date.</p>
                  </div>
                ) : isLoadingSlots ? (
                  <div className="py-20 flex justify-center items-center text-xs text-neutral-400">
                    Checking availability calendar...
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Color legends */}
                    <div className="flex justify-center space-x-4 text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
                      <span className="flex items-center space-x-1">
                        <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>
                        <span>Available</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                        <span>Booked</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <span className="w-2.5 h-2.5 rounded-full bg-neutral-300 dark:bg-neutral-800"></span>
                        <span>Past</span>
                      </span>
                    </div>

                    {/* Timeline grid */}
                    <div className="grid grid-cols-3 gap-2 max-h-72 overflow-y-auto pr-1">
                      {timeSlots.map((time) => {
                        const isPast = isSlotPast(time);
                        const isOccupied = isSlotOccupied(time);
                        const isSelected = selectedTime === time;

                        let slotColorClass = "border border-green-500 text-green-700 bg-green-50/20 dark:text-green-400 dark:bg-green-950/10 hover:bg-green-500 hover:text-white dark:hover:bg-green-500 dark:hover:text-white";
                        
                        if (isPast) {
                          slotColorClass = "bg-neutral-100 text-neutral-300 dark:bg-neutral-950 dark:text-neutral-700 cursor-not-allowed border border-transparent";
                        } else if (isOccupied) {
                          slotColorClass = "bg-red-50/20 border border-red-500 text-red-650 dark:text-red-400 dark:bg-red-950/10 cursor-not-allowed";
                        } else if (isSelected) {
                          slotColorClass = "bg-green-600 border-green-600 text-white font-bold";
                        }

                        return (
                          <button
                            key={time}
                            disabled={isPast || isOccupied}
                            onClick={() => setSelectedTime(time)}
                            className={`py-3.5 rounded-xl text-xs font-semibold transition-all ${slotColorClass}`}
                          >
                            {time}
                          </button>
                        );
                      })}
                    </div>

                    {selectedTime && (
                      <div className="flex justify-end pt-4">
                        <button
                          onClick={() => setStep(2)}
                          className="px-6 py-3 bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 hover:opacity-90 rounded-full text-xs font-semibold tracking-widest uppercase flex items-center space-x-1 transition shadow-sm"
                        >
                          <span>Continue</span>
                          <ChevronRight size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* STEP 2: Choose Duration */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-500 flex items-center space-x-2">
                <Clock size={16} />
                <span>Select Your Package</span>
              </h3>

              {/* Duration Options grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {pricing.map((opt) => {
                  const isSelected = selectedDuration === opt.duration;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => setSelectedDuration(opt.duration)}
                      className={`p-6 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                        isSelected
                          ? "bg-white border-neutral-900 dark:bg-neutral-950 dark:border-neutral-200 ring-1 ring-neutral-900 dark:ring-neutral-200"
                          : "bg-white border-neutral-200 hover:border-neutral-400 dark:bg-neutral-950 dark:border-neutral-850 dark:hover:border-neutral-700"
                      }`}
                    >
                      <div>
                        <span className="text-[10px] font-bold tracking-wider uppercase text-neutral-400">
                          {opt.label}
                        </span>
                        <h4 className="text-2xl font-bold font-serif text-neutral-900 dark:text-white mt-1">
                          {formatPackagePrice(opt.price)}
                        </h4>
                      </div>
                      <p className="text-[10px] text-neutral-500 dark:text-neutral-400 font-light mt-4 leading-relaxed whitespace-pre-line break-words overflow-visible min-h-[56px]">
                        {opt.description}
                      </p>
                    </button>
                  );
                })}
              </div>

              {/* Dynamic calculations & warnings */}
              <div className="bg-white dark:bg-neutral-950 p-6 border border-neutral-100 dark:border-neutral-900 rounded-2xl space-y-4">
                <div className="flex flex-col sm:flex-row justify-between text-xs text-neutral-500 dark:text-neutral-400 space-y-2 sm:space-y-0">
                  <p>Start Time: <strong className="text-neutral-900 dark:text-white">{selectedTime}</strong></p>
                  <p>Estimated End Time: <strong className="text-neutral-900 dark:text-white">{calculatedEndTime}</strong></p>
                  <p>Estimated Price: <strong className="text-neutral-900 dark:text-white">{formatPackagePrice(totalPrice)}</strong></p>
                </div>

                {durationOverlap === "EXCEEDS_CLOSE" && (
                  <div className="p-4 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-250 dark:border-yellow-900 rounded-xl flex items-start space-x-2 text-xs text-yellow-850 dark:text-yellow-400">
                    <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                    <span>This package exceeds our studio closing hours ({dayOpHours?.closeTime}). Please choose a shorter package.</span>
                  </div>
                )}

                {durationOverlap === "OVERLAP" && (
                  <div className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-xl flex items-start space-x-2 text-xs text-red-700 dark:text-red-400">
                    <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                    <span>Selected package overlaps with an existing booking on this day. Please choose a shorter package or select another start time.</span>
                  </div>
                )}
              </div>

              <div className="flex justify-between pt-4">
                <button
                  onClick={() => setStep(1)}
                  className="px-6 py-3 border border-neutral-300 text-neutral-700 dark:border-neutral-800 dark:text-neutral-300 rounded-full text-xs font-semibold tracking-widest uppercase flex items-center space-x-1 hover:bg-neutral-100 dark:hover:bg-neutral-950 transition"
                >
                  <ChevronLeft size={14} />
                  <span>Back</span>
                </button>

                <button
                  disabled={!!durationOverlap}
                  onClick={() => setStep(3)}
                  className="px-6 py-3 bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 rounded-full text-xs font-semibold tracking-widest uppercase flex items-center space-x-1 transition shadow-sm"
                >
                  <span>Continue</span>
                  <ChevronRight size={14} />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: Customer Information */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-500 flex items-center space-x-2">
                <UserIcon size={16} />
                <span>Customer Information</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-1.5">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-white text-sm focus:outline-none focus:ring-1 focus:ring-neutral-900 dark:border-neutral-850 dark:bg-neutral-950 dark:focus:ring-white transition"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-white text-sm focus:outline-none focus:ring-1 focus:ring-neutral-900 dark:border-neutral-850 dark:bg-neutral-950 dark:focus:ring-white transition"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-1.5">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-white text-sm focus:outline-none focus:ring-1 focus:ring-neutral-900 dark:border-neutral-850 dark:bg-neutral-950 dark:focus:ring-white transition"
                    placeholder="+1 (818) 555-0100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-1.5">
                    Booking Notes (Optional)
                  </label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-white text-sm focus:outline-none focus:ring-1 focus:ring-neutral-900 dark:border-neutral-850 dark:bg-neutral-950 dark:focus:ring-white transition"
                    placeholder="Setup requirements, backdrop requests..."
                  />
                </div>
              </div>

              {!session && (
                <div className="p-4 bg-neutral-100 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-900 rounded-xl flex items-center space-x-2 text-[10px] text-neutral-450 dark:text-neutral-500 font-light">
                  <Info size={14} className="shrink-0" />
                  <span>Tip: If you register and sign in, you can track bookings, request cancellations, and view invoice history.</span>
                </div>
              )}

              <div className="flex justify-between pt-4">
                <button
                  onClick={() => setStep(2)}
                  className="px-6 py-3 border border-neutral-300 text-neutral-700 dark:border-neutral-800 dark:text-neutral-300 rounded-full text-xs font-semibold tracking-widest uppercase flex items-center space-x-1 hover:bg-neutral-100 dark:hover:bg-neutral-950 transition"
                >
                  <ChevronLeft size={14} />
                  <span>Back</span>
                </button>

                <button
                  disabled={!customerName || !customerEmail || !customerPhone}
                  onClick={() => setStep(4)}
                  className="px-6 py-3 bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 rounded-full text-xs font-semibold tracking-widest uppercase flex items-center space-x-1 transition shadow-sm"
                >
                  <span>Review Booking</span>
                  <ChevronRight size={14} />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 4: Review Booking */}
          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-500 flex items-center space-x-2">
                <FileText size={16} />
                <span>Review Booking Details</span>
              </h3>

              {/* Booking Summary Box */}
              <div className="bg-white dark:bg-neutral-950 border border-neutral-100 dark:border-neutral-900 rounded-2xl overflow-hidden divide-y divide-neutral-100 dark:divide-neutral-900">
                <div className="p-6 grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-neutral-400 font-light block uppercase tracking-wider">Date</span>
                    <strong className="text-neutral-900 dark:text-white">{formatDisplayDate(selectedDate)}</strong>
                  </div>
                  <div>
                    <span className="text-neutral-400 font-light block uppercase tracking-wider">Time Window</span>
                    <strong className="text-neutral-900 dark:text-white">{selectedTime} - {calculatedEndTime} ({selectedDuration})</strong>
                  </div>
                </div>

                <div className="p-6 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-neutral-400 font-light block uppercase tracking-wider">Client Name</span>
                    <strong className="text-neutral-900 dark:text-white">{customerName}</strong>
                  </div>
                  <div>
                    <span className="text-neutral-400 font-light block uppercase tracking-wider">Email</span>
                    <strong className="text-neutral-900 dark:text-white">{customerEmail}</strong>
                  </div>
                  <div>
                    <span className="text-neutral-400 font-light block uppercase tracking-wider">Phone</span>
                    <strong className="text-neutral-900 dark:text-white">{customerPhone}</strong>
                  </div>
                </div>

                {notes && (
                  <div className="p-6 text-xs">
                    <span className="text-neutral-400 font-light block uppercase tracking-wider mb-1">Booking Notes</span>
                    <p className="text-neutral-800 dark:text-neutral-200 font-light italic">&ldquo;{notes}&rdquo;</p>
                  </div>
                )}

                <div className="p-6 bg-neutral-50/50 dark:bg-neutral-950/50 flex justify-between items-center text-xs">
                  <div>
                    <strong className="text-neutral-900 dark:text-white">Studio Booking Rate</strong>
                    <p className="text-[10px] text-neutral-400 font-light">Price includes local sales tax</p>
                  </div>
                  <strong className="text-lg font-bold font-serif text-neutral-900 dark:text-white">{formatPackagePrice(totalPrice)}</strong>
                </div>
              </div>

              {bookingError && (
                <div className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-xl flex items-start space-x-2 text-xs text-red-700 dark:text-red-400">
                  <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                  <span>{bookingError}</span>
                </div>
              )}

              <div className="flex justify-between pt-4">
                <button
                  disabled={isSubmitting}
                  onClick={() => setStep(3)}
                  className="px-6 py-3 border border-neutral-300 text-neutral-700 dark:border-neutral-800 dark:text-neutral-300 rounded-full text-xs font-semibold tracking-widest uppercase flex items-center space-x-1 hover:bg-neutral-100 dark:hover:bg-neutral-950 transition"
                >
                  <ChevronLeft size={14} />
                  <span>Back</span>
                </button>

                <button
                  disabled={isSubmitting}
                  onClick={handleConfirmBooking}
                  className="px-8 py-3.5 bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 rounded-full text-xs font-semibold tracking-widest uppercase flex items-center justify-center space-x-2 transition shadow"
                >
                  {isSubmitting ? (
                    <span>Creating Booking...</span>
                  ) : (
                    <>
                      <CheckCircle2 size={14} />
                      <span>Confirm Booking</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 5: Booking Confirmation (Success) */}
          {step === 5 && (
            <motion.div
              key="step5"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8 space-y-6 max-w-md mx-auto"
            >
              <div className="inline-flex p-4 bg-green-50 dark:bg-green-950/20 text-green-600 dark:text-green-400 rounded-full shadow-sm">
                <CheckCircle2 size={48} strokeWidth={1.5} />
              </div>
              
              <div className="space-y-2">
                <h3 className="font-serif text-3xl font-bold text-neutral-900 dark:text-white">Booking Confirmed!</h3>
                <p className="text-xs font-light text-neutral-500 dark:text-neutral-400 leading-relaxed">
                  Thank you! Your booking request has been submitted successfully and is currently pending review by our studio managers.
                </p>
              </div>

              {/* Confirmation Details Card */}
              <div className="bg-white dark:bg-neutral-950 border border-neutral-100 dark:border-neutral-900 p-6 rounded-2xl text-xs space-y-3 text-left">
                <p className="flex justify-between border-b border-neutral-100 dark:border-neutral-900 pb-2">
                  <span className="text-neutral-400 font-light">Reference Number:</span>
                  <strong className="font-mono text-neutral-900 dark:text-white uppercase select-all">{bookingReference}</strong>
                </p>
                <p className="flex justify-between border-b border-neutral-100 dark:border-neutral-900 pb-2">
                  <span className="text-neutral-400 font-light">Date:</span>
                  <strong className="text-neutral-900 dark:text-white">{formatCompactDate(selectedDate)}</strong>
                </p>
                <p className="flex justify-between border-b border-neutral-100 dark:border-neutral-900 pb-2">
                  <span className="text-neutral-400 font-light">Time Range:</span>
                  <strong className="text-neutral-900 dark:text-white">{selectedTime} - {calculatedEndTime}</strong>
                </p>
                <p className="flex justify-between">
                  <span className="text-neutral-400 font-light">Total Cost:</span>
                  <strong className="text-neutral-900 dark:text-white">{new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(totalPrice)}</strong>
                </p>
              </div>

              <div className="p-4 bg-neutral-100 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-900 rounded-xl flex items-start space-x-2 text-[10px] text-neutral-450 dark:text-neutral-500 text-left font-light leading-relaxed">
                <Info size={14} className="shrink-0 mt-0.5" />
                <span>We have logged a confirmation email to the email address provided ({customerEmail}). You can check the server logs to view the formatted HTML email simulated message.</span>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => {
                    setSelectedTime("");
                    setNotes("");
                    setStep(1);
                  }}
                  className="px-5 py-2.5 border border-neutral-300 text-neutral-750 dark:border-neutral-800 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-950 rounded-full text-xs font-semibold tracking-wider uppercase transition"
                >
                  Book Another Session
                </button>
                {session ? (
                  <a
                    href="/my-bookings"
                    className="px-5 py-2.5 bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 hover:opacity-90 rounded-full text-xs font-semibold tracking-wider uppercase transition shadow-sm text-center"
                  >
                    View My Bookings
                  </a>
                ) : (
                  <a
                    href="/login"
                    className="px-5 py-2.5 bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 hover:opacity-90 rounded-full text-xs font-semibold tracking-wider uppercase transition shadow-sm text-center"
                  >
                    Sign In to Manage
                  </a>
                )}
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
