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
import { LockKeyhole } from "lucide-react";
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
    (async () => {
      if (supabaseUser?.id && !isSubscribed) {
        const {
          data: { telegram_url, whatsapp_url },
        } = await axios.post("/api/razorpay/create-subscription-link", {
          user_id: supabaseUser?.id,
          email: supabaseUser?.email,
        });
        setLinkToWhatsapp(whatsapp_url);
        setLinkToTelegram(telegram_url);
      }
    })();
  }, [supabaseUser, isSubscribed]);
  useEffect(() => {
    (async () => {
      if (supabaseUser?.id && !isSubscribed) {
        const {
          data: { url },
        } = await axios.post("/api/stripe/checkout-pro", {
          redirect_url: window.location.origin,
          user_id: supabaseUser?.id,
        });
        setStripeLinkToWhatsapp(url);
      }
    })();
  }, [supabaseUser, isSubscribed]);
  {
    console.log(
      subscribeData,
      subscribeData?.razorpay_data?.subscription?.entity?.plan_id ===
        "plan_OUbCVEGaA370XM",
      subscribeData?.razorpay_data?.subscription?.entity?.plan_id
    );
  }
  return (
    <div className="w-full px-4 min-h-[70vh]">
      <p className="text-2xl">Hey {supabaseUser?.full_name}</p>
      <p className="text-sm mb-5">What do you wanna do today !</p>
      {!isSubscribed && (
        <Card className="max-w-md">
          <CardHeader className="justify-between">
            <div className="flex gap-5">
              <Avatar
                isBordered
                radius="full"
                size="md"
                src="https://vswwfumiihhlpfevsxcr.supabase.co/storage/v1/object/public/assets/t-logo.png"
              />
              <div className="flex flex-col gap-1 items-start justify-center">
                <h4 className="text-small font-semibold leading-none text-default-600">
                  Pulsepeak AI
                </h4>
                <h5 className="text-small tracking-tight text-default-400">
                  @pulsepeak ai
                </h5>
              </div>
            </div>
          </CardHeader>
          <CardBody className="px-3 py-0 text-small text-default-400">
            <p className="text-xl font-medium text-white">
              Hey there , I can see you're not subscribed to pulsepeak , it's
              only {isInIndia ? "INR 49" : "4.5 USD"}/ Month to gain access to
              all the amazing features !
            </p>
            <p>
              Note : after payment please wait for 40-60 seconds for the payment
              to be processed.
            </p>
          </CardBody>
          <CardFooter className="gap-3 block">
            {isInIndia ? (
              <>
                {Boolean(linkToWhatsapp) && (
                  <div>
                    <a
                      target="_blank"
                      href={linkToWhatsapp}
                      onClick={() => {
                        setLoading(true);
                      }}
                      className="text-black flex text-xl bg-green-400 hover:bg-green-400 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-green-400 dark:hover:bg-green-400 focus:outline-none "
                      rel="noopener"
                    >
                      {loading ? (
                        <>
                          <Spinner color="primary" />
                        </>
                      ) : (
                        <>
                          <img
                            className="w-20 h-20 mr-2 rounded-full"
                            src="https://i.pinimg.com/736x/6c/78/49/6c784972cbf5806215d46fbda8b0c46a.jpg"
                          />{" "}
                          <div>
                            <p>
                              Subscribe the Whatsapp Version for INR 49/Month
                            </p>
                            <p className="text-sm">
                              Recieve Regular updates on whatsapp
                            </p>
                            <Chip size="sm" color="primary">
                              Recommended
                            </Chip>
                          </div>
                        </>
                      )}
                    </a>
                  </div>
                )}
                {Boolean(linkToTelegram) && (
                  <div>
                    <a
                      target="_blank"
                      href={linkToTelegram}
                      className="text-black mt-3 flex text-xl bg-blue-500 hover:bg-blue-500 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-500 dark:hover:bg-blue-500 focus:outline-none "
                      rel="noopener"
                    >
                      {loading ? (
                        <>
                          <Spinner color="white" />
                        </>
                      ) : (
                        <>
                          <img
                            className="w-20 h-20 mr-2 rounded-full"
                            src="https://vswwfumiihhlpfevsxcr.supabase.co/storage/v1/object/public/assets/png_transparent_computer_icons_telegram_logo_angle_white_triangle_thumbnail_removebg_preview.png?t=2024-07-07T21%3A48%3A59.982Z"
                          />{" "}
                          <div>
                            <p className="text-white">
                              Subscribe the Telegram Version for INR 29/Month
                            </p>
                            <p className="text-sm text-white">
                              Recieve Regular updates on Telegram
                            </p>
                          </div>
                        </>
                      )}
                    </a>
                  </div>
                )}
              </>
            ) : (
              <>
                {Boolean(stripeLinkToWhatsapp) && (
                  <div>
                    <a
                      target="_blank"
                      href={stripeLinkToWhatsapp}
                      onClick={() => {
                        setLoading(true);
                      }}
                      className="text-black flex text-xl bg-green-400 hover:bg-green-400 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-green-400 dark:hover:bg-green-400 focus:outline-none "
                      rel="noopener"
                    >
                      {loading ? (
                        <>
                          <Spinner color="primary" />
                        </>
                      ) : (
                        <>
                          <img
                            className="w-20 h-20 mr-2 rounded-full"
                            src="https://i.pinimg.com/736x/6c/78/49/6c784972cbf5806215d46fbda8b0c46a.jpg"
                          />{" "}
                          <div>
                            <p>
                              Subscribe the Whatsapp Version for USD 4.5/Month
                            </p>
                            <p className="text-sm">
                              Recieve Regular updates on whatsapp
                            </p>
                            <Chip size="sm" color="primary">
                              Recommended
                            </Chip>
                          </div>
                        </>
                      )}
                    </a>
                  </div>
                )}
              </>
            )}
          </CardFooter>
        </Card>
      )}
      {subscribeData?.razorpay_data?.payload?.subscription?.entity?.plan_id ===
        "plan_OUbCVEGaA370XM" &&
        !supabaseUser?.telegram_chat_id && (
          <Card>
            <CardBody>
              <p>
                We see that you have subscribed to the telegram version, please
                do the following{" "}
              </p>
              <p>Go to the Pulsepeak Telegram</p>
              <a
                href="https://t.me/pulsepeak_bot"
                className="my-2"
                target="_blank"
              >
                <Button color="primary">Pulsepeak Telegram</Button>
              </a>
              <p>Then paste the user activation code</p>
              <Snippet size="lg">
                useractivation:{btoa(supabaseUser?.email)}
              </Snippet>
            </CardBody>
          </Card>
        )}
      {!isSubscribed && (
        <div className="text-center top-10 z-40 left-[20%]">
          <LockKeyhole className="mx-auto" size={80} />
          <p>Please subscribe in order to access all the amazing features</p>
        </div>
      )}

      <div
        className={`grid relative lg:grid-cols-2 mt-2 gap-4 grid-cols-1 ${
          isSubscribed ? "" : "opacity-45"
        }`}
      >
        <Link
          href={!isSubscribed ? "/" : "/app/reminder"}
          className="w-full text-left"
        >
          <div className="relative w-full h-64 rounded-lg overflow-hidden shadow-lg">
            <div
              className="absolute w-full h-full bg-cover bg-center"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1581646064576-6bc5a216f02c?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHJlbWluZGVyfGVufDB8MHwwfHx8MA%3D%3D')",
              }}
            ></div>
            <div className="absolute w-full h-full bg-black opacity-50"></div>
            <div className="relative top-36 bottom-3 p-4 text-white">
              <h2 className="text-2xl font-semibold mb-1">
                Workout Reminders and Lift Tracker
              </h2>
              <p className="text-base">
                We'll remind of you of you're workouts and keep you on track 🔥
              </p>
            </div>
          </div>
        </Link>
        <Link
          href={!isSubscribed ? "/" : "/app/workout"}
          className="relative w-full text-left"
        >
          <div className="relative w-full h-64 rounded-lg overflow-hidden shadow-lg">
            <div
              className="absolute w-full h-full bg-cover bg-center"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1581009137042-c552e485697a?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8d29ya291dHxlbnwwfDB8MHx8fDA%3D')",
              }}
            ></div>
            <div className="absolute w-full h-full bg-black opacity-50"></div>
            <div className="relative top-36 bottom-3 p-4 text-white">
              <h2 className="text-2xl font-semibold mb-1">Workout Planning</h2>
              <p className="text-base">
                We'll create a FREE pdf for you , for an ultimate workout
                according to your needs 🔥
              </p>
            </div>
          </div>
        </Link>
        <Link
          href={!isSubscribed ? "/" : "/app/diet"}
          className="relative w-full text-left"
        >
          <div className="w-full h-64 rounded-lg overflow-hidden shadow-lg">
            <div
              className="absolute w-full h-full bg-cover bg-center"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1625937286074-9ca519d5d9df?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fGRpZXR8ZW58MHwwfDB8fHww')",
              }}
            ></div>
            <div className="absolute w-full h-full bg-black opacity-50"></div>
            <div className="relative top-36 bottom-3 p-4 text-white">
              <h2 className="text-2xl font-semibold mb-1">Diet Planning</h2>
              <p className="text-base">
                Let's plan your diet according to your fitness needs, and get
                you healthy !
              </p>
            </div>
          </div>
        </Link>
        <Link
          href={!isSubscribed ? "/" : "/app/leaderboard"}
          className="relative w-full text-left"
        >
          <div className=" opacity-65 w-full h-64 rounded-lg overflow-hidden shadow-lg">
            <div
              className="absolute w-full h-full bg-cover bg-center"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1687393629507-a594caa64c1b?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Z3ltJTIwY29tbXVuaXR5fGVufDB8fDB8fHww')",
              }}
            ></div>
            <div className="absolute w-full h-full bg-black opacity-50"></div>
            <div className="relative top-36 bottom-3 p-4 text-white">
              <h2 className="text-2xl font-semibold mb-1">
                Fitness Leaderboard
              </h2>
              <p className="text-base">See where you stand among your peers</p>
            </div>
          </div>
          <button className="top-3 absolute left-3 bg-green-600 rounded-full px-5 text-xs py-1">
            Coming Soon
          </button>
        </Link>
      </div>
    </div>
  );
};
