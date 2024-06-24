// @ts-nocheck
"use client";
import AuthButton from "@/components/AuthButton";
import React, { useState } from "react";
import { WorkoutPlanForm } from "@/components/WorkoutComponent";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Oval } from "react-loader-spinner";
import { Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import axios from "axios";
import htmltoPdf from "html2pdf.js";
import dayjs from "dayjs";
import { toast } from "sonner";
import { useAuth } from "@/utils/hooks/useSupabase";

function generateWorkoutPlan(days: any, name: string) {
  let html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Weekly Workout Plan</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link
    href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap"
    rel="stylesheet"
  />
  <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.9.2/html2pdf.bundle.min.js"></script>
  <style>
  body {
    font-family: 'Poppins', sans-serif;
    margin: 0;
    padding: 0;
    background-color: #1a202c; /* Tailwind's bg-gray-900 */
    color: #e2e8f0; /* Tailwind's text-gray-300 */
  }
  .a4 {
    width: 210mm;
    min-height: 297mm;
    background-color: #2d3748; /* Tailwind's bg-gray-800 */
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); /* Tailwind's shadow-lg */
    padding: 20mm;
    padding-bottom:150mm;
    box-sizing: border-box;
  }
  .header {
    text-align: center;
    margin-bottom: 20px;
  }
  .header h1 {
    font-size: 2.25rem; /* Tailwind's text-4xl */
    font-weight: 700; /* Tailwind's font-bold */
    color: #ffffff; /* Tailwind's text-white */
    margin-bottom: 1rem; /* Tailwind's mb-4 */
  }
  .header p {
    font-size: 1.125rem; /* Tailwind's text-lg */
    color: #ffffff; /* Tailwind's text-white */
  }
  .person-info p {
    color: #e2e8f0; /* Tailwind's text-gray-300 */
  }
  .person-info span {
    color: #e2e8f0;
    font-weight: 600; /* Tailwind's font-semibold */
  }
  #person-name {
    font-size: 1.875rem; /* Tailwind's text-3xl */
    color: #ffffff; /* Tailwind's text-white */
  }
  #current-date {
    color: #ffffff; /* Tailwind's text-white */
  }
  .pulse-peak-logo {
    font-size: 1.5rem; /* Tailwind's text-2xl */
  }
  .workout-section {
    margin-bottom: 20px;
  }
  .workout-section h2 {
    font-size: 1.5rem; /* Tailwind's text-2xl */
    font-weight: 600; /* Tailwind's font-semibold */
    margin-bottom: 0.5rem; /* Tailwind's mb-2 */
  }
  .workout-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 20px;
  }
  .workout-table th, .workout-table td {
    border: 1px solid #e2e8f0; /* Tailwind's border-gray-300 */
    padding: 0.5rem; /* Tailwind's p-2 */
    text-align: left;
  }
  .chip {
    background-color: #2d3748; /* Tailwind's bg-gray-800 */
    padding: 0.25rem 0.5rem; /* Tailwind's px-2 py-1 */
    border-radius: 9999px; /* Tailwind's rounded-full */
  }
  .summary {
    margin-top: 20px;
  }
  .summary h2 {
    font-size: 1.5rem; /* Tailwind's text-2xl */
    font-weight: 600; /* Tailwind's font-semibold */
    margin-bottom: 0.5rem; /* Tailwind's mb-2 */
  }
  .summary p {
    font-size: 1rem;
    margin-bottom: 20px;
  }
  .footer {
    text-align: center;
    margin-top: 20px;
  }
  .footer p {
    font-size: 1rem;
  }
  .footer .font-bold {
    font-weight: 700; /* Tailwind's font-bold */
  }
  .linkForVideo {
    color: #2563eb !important;
  }
</style>
</head>
<body>
  <div id="content">
    <div class="a4 shadow-lg">
      <div class="header">
        <h1>
          Weekly Workout Plan
        </h1>
        <p>
          Your personalized plan to stay fit and healthy
        </p>
      </div>

      <div class="person-info">
        <p><span id="person-name">${name}</span></p>
        <p><span id="current-date">${dayjs(new Date()).format(
          "DD MMMM YYYY"
        )}</span></p>
        <h1 class="pulse-peak-logo">PulsePeak AI</h1>
      </div>
`;

  days.forEach((day: any) => {
    html += `<div class="workout-section">
        <h2>${day.name}</h2>
        <table class="workout-table">
          <thead>
            <tr>
              <th>Exercise</th>
              <th>Reps</th>
              <th>Sets</th>
              <th>Notes</th>
              <th>Link</th>
            </tr>
          </thead>
          <tbody>`;

    day.workouts.forEach((workout: any) => {
      html += `<tr>
              <td>${workout.exercise}</td>
              <td>${workout.reps}</td>
              <td>${workout.sets}</td>
              <td><span class="chip">${workout.notes}</span></td>
              <td>
                <a href="${workout.link}" class="linkForVideo" target="_blank">View</a>
              </td>
            </tr>`;
    });

    html += `</tbody>
        </table>
      </div>`;
  });

  html += `<div class="summary">
        <h2 class="text-2xl font-semibold mb-2">Summary</h2>
        <p>
          Congratulations on completing your weekly workout plan! Remember to
          stay hydrated and maintain a balanced diet to complement your
          exercise routine.
        </p>
      </div>

      <div class="footer">
        <p>Powered by <span class="font-bold">PulsePeak AI</span></p>
      </div>
    </div>
  </div>
  <script>
    document
      .getElementById("download-pdf")
      .addEventListener("click", function () {
        const element = document.querySelector(".a4");
        const opt = {
          margin: 0,
          filename: "workout-plan.pdf",
          image: { type: "jpeg", quality: 1 },
          html2canvas: { scale: 2 },
          jsPDF: { unit: "pt", format: "a4", orientation: "portrait" },
        };

        html2pdf().set(opt).from(element).save();
      });

    // Set the current date
    const currentDate = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    document.getElementById("current-date").textContent = currentDate;
  </script>
</body>
</html>`;

  return html;
}

const WorkoutPlanning = () => {
  const [loading, setLoading] = useState(false);
  const supabase = useSupabaseClient();
  const { push } = useRouter();
  const { supabaseUser } = useAuth();
  const [success, setSuccess] = useState(false);

  const onSubmit = async (formdata: any) => {
    setLoading(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const {
        data: { data },
      } = await axios.post("/api/app/create_workouts", formdata);
      const generatedHTML = generateWorkoutPlan(data, supabaseUser.full_name);
      const options = {
        margin: 0,
        filename: "workout-plan.pdf",
        image: { type: "jpeg", quality: 1 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "pt", format: "a4", orientation: "portrait" },
      };
      var tempContainer = document.createElement("div");
      tempContainer.innerHTML = generatedHTML;
      console.log(generatedHTML);
      htmltoPdf().set(options).from(tempContainer).save();
      toast.success("Successfully download your workout plan");
      setSuccess(true);
    } catch {}
  };

  return (
    <div className="w-screen">
      <nav className="w-full flex justify-center border-b border-b-foreground/10 h-24">
        <div className="w-full max-w-[1024px] flex justify-between items-center p-3 text-sm">
          <img
            className="h-16 w-16"
            src="https://vswwfumiihhlpfevsxcr.supabase.co/storage/v1/object/public/assets/t-logo.png"
          />
          <AuthButton />
        </div>
      </nav>

      <div className="p-3 max-w-[1024px] w-full mx-auto">
        <Button
          onClick={() => {
            push("/");
          }}
          variant="flat"
          color="primary"
        >
          Back
        </Button>
        {!success && (
          <>
            <p className="text-2xl font-medium mt-4">
              Let's plan you an amazing workouts ⚡ 🔌
            </p>
            <p className="text-xs mt-1 mb-3">
              (Please note you must be going to a gym to follow these workout
              plans)
            </p>
          </>
        )}

        {success ? (
          <div className="p-2">
          <p className="p-2 text-xl">Successfully generated a workout plan</p>
          </div>
        ) : loading ? (
          <>
            <div className="p-3 text-center">
              <p className="animate-pulse">
                Using advanced AI models to build you the best workout plan for
                you{" "}
              </p>
              <div className="mx-auto mt-2 w-[fit-content]">
                <Oval
                  visible={true}
                  height="35"
                  width="35"
                  color="#2547f5"
                  secondaryColor="#ccd4ff"
                  ariaLabel="oval-loading"
                />
              </div>
            </div>
          </>
        ) : (
          <WorkoutPlanForm onSubmit={onSubmit} />
        )}
      </div>
    </div>
  );
};

export default WorkoutPlanning;
