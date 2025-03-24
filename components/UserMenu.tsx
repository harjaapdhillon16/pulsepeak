import { useAuth } from "@/utils/hooks/useSupabase";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Avatar,
  Chip,
  Spinner,
  Button,
} from "@nextui-org/react";
import axios from "axios";
import { LockKeyhole, Clock, CalendarDays, BarChart3, Apple, Trophy, LineChart } from "lucide-react";
import { Snippet } from "@nextui-org/react";
import { useLocationInIndia } from "@/utils/hooks/useIsIndia/useIndia";

export const UserMenu = ({
  isSubscribed,
  subscribeData,
}: {
  isSubscribed: boolean;
  subscribeData: any;
}) => {
  const { supabaseUser } = useAuth();
  const [linkToWhatsapp, setLinkToWhatsapp] = useState("");
  const [linkToTelegram, setLinkToTelegram] = useState("");
  const [stripeLinkToWhatsapp, setStripeLinkToWhatsapp] = useState("");
  const [loading, setLoading] = useState(false);
  const { isInIndia } = useLocationInIndia();

  useEffect(() => {
    const fetchRazorpayLinks = async () => {
      if (supabaseUser?.id && !isSubscribed) {
        try {
          const {
            data: { telegram_url, whatsapp_url },
          } = await axios.post("/api/razorpay/create-subscription-link", {
            user_id: supabaseUser?.id,
            email: supabaseUser?.email,
          });
          setLinkToWhatsapp(whatsapp_url);
          setLinkToTelegram(telegram_url);
        } catch (error) {
          console.error("Error fetching Razorpay links:", error);
        }
      }
    };

    fetchRazorpayLinks();
  }, [supabaseUser, isSubscribed]);

  useEffect(() => {
    const fetchStripeLink = async () => {
      if (supabaseUser?.id && !isSubscribed) {
        try {
          const {
            data: { url },
          } = await axios.post("/api/stripe/checkout-pro", {
            redirect_url: window.location.origin,
            user_id: supabaseUser?.id,
          });
          setStripeLinkToWhatsapp(url);
        } catch (error) {
          console.error("Error fetching Stripe link:", error);
        }
      }
    };

    fetchStripeLink();
  }, [supabaseUser, isSubscribed]);

  const featureCards = [
    {
      title: "Workout Reminders",
      description: "Stay on track with personalized workout reminders",
      icon: <Clock className="w-8 h-8" />,
      image: "https://images.unsplash.com/photo-1581646064576-6bc5a216f02c?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHJlbWluZGVyfGVufDB8MHwwfHx8MA%3D%3D",
      href: "/app/reminder",
    },
    {
      title: "Workout Planning",
      description: "Custom workout plans tailored to your fitness goals",
      icon: <CalendarDays className="w-8 h-8" />,
      image: "https://images.unsplash.com/photo-1581009137042-c552e485697a?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8d29ya291dHxlbnwwfDB8MHx8fDA%3D",
      href: "/app/workout",
    },
    {
      title: "Diet Planning",
      description: "Nutrition plans optimized for your fitness journey",
      icon: <Apple className="w-8 h-8" />,
      image: "https://images.unsplash.com/photo-1625937286074-9ca519d5d9df?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fGRpZXR8ZW58MHwwfDB8fHww",
      href: "/app/diet",
    },
    {
      title: "Fitness Analytics",
      description: "Track your fitness analytics",
      icon: <LineChart className="w-8 h-8" />,
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      href: "/app/analytics",
    },
    {
      title: "Fitness Leaderboard",
      description: "Compare your progress with the community",
      icon: <Trophy className="w-8 h-8" />,
      image: "https://images.unsplash.com/photo-1687393629507-a594caa64c1b?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Z3ltJTIwY29tbXVuaXR5fGVufDB8fDB8fHww",
      href: "/app/leaderboard",
      comingSoon: true,
    },
  ];

  const renderSubscriptionOptions = () => {
    if (isInIndia) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          {Boolean(linkToWhatsapp) && (
            <SubscriptionCard
              title="WhatsApp Plan"
              price="₹49"
              period="month"
              description="Get regular updates and reminders via WhatsApp"
              icon="https://i.pinimg.com/736x/6c/78/49/6c784972cbf5806215d46fbda8b0c46a.jpg"
              buttonText="Subscribe via WhatsApp"
              href={linkToWhatsapp}
              loading={loading}
              setLoading={setLoading}
              recommended={true}
              color="bg-gradient-to-r from-green-500 to-teal-400"
            />
          )}
          {Boolean(linkToTelegram) && (
            <SubscriptionCard
              title="Telegram Plan"
              price="₹29"
              period="month"
              description="Get regular updates and reminders via Telegram"
              icon="https://vswwfumiihhlpfevsxcr.supabase.co/storage/v1/object/public/assets/png_transparent_computer_icons_telegram_logo_angle_white_triangle_thumbnail_removebg_preview.png?t=2024-07-07T21%3A48%3A59.982Z"
              buttonText="Subscribe via Telegram"
              href={linkToTelegram}
              loading={loading}
              setLoading={setLoading}
              color="bg-gradient-to-r from-blue-500 to-blue-400"
            />
          )}
        </div>
      );
    }
    
    return (
      <div className="w-full md:w-1/2">
        {Boolean(stripeLinkToWhatsapp) && (
          <SubscriptionCard
            title="WhatsApp Plan"
            price="$4.50"
            period="month"
            description="Get regular updates and reminders via WhatsApp"
            icon="https://i.pinimg.com/736x/6c/78/49/6c784972cbf5806215d46fbda8b0c46a.jpg"
            buttonText="Subscribe Now"
            href={stripeLinkToWhatsapp}
            loading={loading}
            setLoading={setLoading}
            recommended={true}
            color="bg-gradient-to-r from-green-500 to-teal-400"
          />
        )}
      </div>
    );
  };

  const isTelegramUser = subscribeData?.razorpay_data?.payload?.subscription?.entity?.plan_id === "plan_OUbCVEGaA370XM";
  const needsTelegramActivation = isTelegramUser && !supabaseUser?.telegram_chat_id;

  return (
    <div className="w-screen px-8 py-8 mx-auto">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">
          Welcome, {supabaseUser?.full_name || "Fitness Enthusiast"}!
        </h1>
        <p className="text-base text-gray-400 mt-1">Your personal fitness dashboard awaits.</p>
      </div>

      {/* Subscription Section */}
      {!isSubscribed && (
        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-4 text-white">Unlock Premium Features</h2>
          <Card className="bg-gradient-to-b from-gray-800 to-gray-900 border border-gray-700 shadow-xl">
            <CardHeader className="flex gap-4 items-center pb-0">
              <Avatar
                radius="lg"
                size="lg"
                src="https://vswwfumiihhlpfevsxcr.supabase.co/storage/v1/object/public/assets/t-logo.png"
                className="border-2 border-white/20"
              />
              <div>
                <p className="text-lg font-bold">Pulsepeak AI Premium</p>
                <p className="text-sm text-gray-400">Elevate your fitness journey</p>
              </div>
            </CardHeader>
            <CardBody>
              <div className="space-y-4">
                <p className="text-lg">
                  Unlock all premium features for just {isInIndia ? "₹49" : "$4.50"} per month
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
                      <span className="text-green-500 text-xs">✓</span>
                    </div>
                    <span>Personalized workout plans</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
                      <span className="text-green-500 text-xs">✓</span>
                    </div>
                    <span>Custom diet recommendations</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
                      <span className="text-green-500 text-xs">✓</span>
                    </div>
                    <span>Daily reminders and motivation</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
                      <span className="text-green-500 text-xs">✓</span>
                    </div>
                    <span>Progress tracking and analytics</span>
                  </li>
                </ul>
                <p className="text-xs text-gray-400">
                  Note: After payment, please wait 40-60 seconds for processing.
                </p>
              </div>
            </CardBody>
            <CardFooter>
              {renderSubscriptionOptions()}
            </CardFooter>
          </Card>
        </div>
      )}

      {/* Telegram Activation Notice */}
      {needsTelegramActivation && (
        <Card className="mb-10 bg-gradient-to-r from-blue-900/50 to-blue-800/50 border border-blue-700/50">
          <CardBody className="p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
              <div className="p-3 bg-blue-700/30 rounded-full">
                <img 
                  src="https://vswwfumiihhlpfevsxcr.supabase.co/storage/v1/object/public/assets/png_transparent_computer_icons_telegram_logo_angle_white_triangle_thumbnail_removebg_preview.png?t=2024-07-07T21%3A48%3A59.982Z" 
                  className="w-12 h-12" 
                  alt="Telegram Logo"
                />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-2">Complete Your Telegram Activation</h3>
                <p className="text-gray-300 mb-4">To receive updates on Telegram, please complete these steps:</p>
                <ol className="list-decimal list-inside mb-4 space-y-2 text-gray-300">
                  <li>Go to the Pulsepeak Telegram bot</li>
                  <li>Send the activation code below</li>
                </ol>
                <div className="space-y-4">
                  <a href="https://t.me/pulsepeak_bot" target="_blank" rel="noopener noreferrer">
                    <Button color="primary" className="w-full md:w-auto">
                      Open Telegram Bot
                    </Button>
                  </a>
                  <div className="mt-2">
                    <p className="text-sm mb-1 text-gray-300">Your activation code:</p>
                    <Snippet 
                      size="lg" 
                      classNames={{
                        base: "bg-gray-800 border border-gray-700",
                        pre: "text-gray-100"
                      }}
                    >
                      useractivation:{btoa(supabaseUser?.email)}
                    </Snippet>
                  </div>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Features Grid */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4 text-white">Your Fitness Tools</h2>
        
        {!isSubscribed && (
          <div className="rounded-xl p-4 mb-6 bg-gray-800/50 border border-gray-700 flex items-center gap-4">
            <LockKeyhole className="text-amber-500 w-6 h-6" />
            <p className="text-gray-300">Subscribe to unlock all premium features</p>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative">
          {featureCards.map((card, index) => (
            <Link
              key={index}
              href={isSubscribed ? card.href : "/"}
              className={`block group transition-all duration-300 ${!isSubscribed ? "pointer-events-none" : ""}`}
            >
              <div className="relative h-64 rounded-xl overflow-hidden shadow-lg border border-gray-700 group-hover:border-blue-500/50 transition-all">
                {/* Background Image */}
                <div
                  className="absolute inset-0 bg-cover bg-center transition-all duration-500 group-hover:scale-110"
                  style={{ backgroundImage: `url('${card.image}')` }}
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-80" />
                
                {/* Card Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-full bg-blue-500/20 backdrop-blur-sm">
                      {card.icon}
                    </div>
                    <h3 className="text-xl font-bold">{card.title}</h3>
                  </div>
                  <p className="text-gray-300">{card.description}</p>
                </div>
                
                {/* Coming Soon Badge */}
                {card.comingSoon && (
                  <div className="absolute top-4 left-4">
                    <Chip 
                      color="success" 
                      variant="shadow"
                      size="sm"
                    >
                      Coming Soon
                    </Chip>
                  </div>
                )}
                
                {/* Locked Overlay */}
                {!isSubscribed && (
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center">
                    <LockKeyhole className="text-gray-400 w-10 h-10 mb-2" />
                    <p className="text-gray-400 font-medium">Premium Feature</p>
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

// Subscription Card Component
const SubscriptionCard = ({ 
  title, 
  price, 
  period, 
  description, 
  icon, 
  buttonText, 
  href, 
  loading, 
  setLoading, 
  recommended = false,
  color = "bg-gradient-to-r from-blue-600 to-indigo-500"
}) => {
  return (
    <div className={`rounded-xl p-5 ${color} transition-transform duration-300 hover:scale-[1.02] h-full`}>
      <div className="flex items-start gap-4 mb-4">
        <img src={icon} alt={title} className="w-12 h-12 rounded-full object-cover" />
        <div className="flex-1">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-white">{title}</h3>
            {recommended && (
              <Chip color="warning" variant="flat" size="sm">Recommended</Chip>
            )}
          </div>
          <p className="text-white/80 text-sm mb-2">{description}</p>
          <div className="flex items-end gap-1">
            <span className="text-2xl font-bold text-white">{price}</span>
            <span className="text-white/80 text-sm">/{period}</span>
          </div>
        </div>
      </div>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => setLoading(true)}
        className="block w-full"
      >
        <Button 
          className="w-full bg-white/90 text-gray-900 font-medium hover:bg-white"
          size="lg"
          disabled={loading}
        >
          {loading ? <Spinner size="sm" color="current" /> : buttonText}
        </Button>
      </a>
    </div>
  );
};