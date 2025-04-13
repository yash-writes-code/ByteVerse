"use client";
import { useEffect, useRef, useState } from "react";
import POSE_CONNECTIONS from "@mediapipe/pose";
import { analyzePose } from "@/utils/Analysze";

export default function Home() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  // New refs for pose and camera instances:
  const poseRef = useRef(null);
  const cameraRef = useRef(null);

  const [exercise, setExercise] = useState("inclined_dumbbell_press");
  const [feedback, setFeedback] = useState("");
  const [connectionError, setConnectionError] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzerKey, setAnalyzerKey] = useState(Date.now());
  const f ="helo\nhii";
  const exerciseSteps = {
    squat: [
      "Stand with feet shoulder-width apart",
      "Keep your back straight and chest up",
      "Lower your body by bending knees and pushing hips back",
      "Keep knees in line with toes, not extending past them",
      "Go as deep as comfortable, ideally until thighs are parallel to ground",
      "Push through heels to return to starting position",
    ],
    bulgarian_squat: [
      "Stand a few feet in front of a bench or step",
      "Place one foot behind you on the bench with laces down",
      "Keep your front foot flat and torso upright",
      "Lower your body until your front thigh is parallel to the floor",
      "Make sure front knee stays in line with your ankle",
      "Push through the front heel to return to starting position",
    ],
    seated_shoulder_press: [
      "Sit on a bench with back support and hold dumbbells at shoulder height",
      "Keep your feet flat on the floor and core engaged",
      "Press the dumbbells upward until your arms are fully extended",
      "Avoid locking your elbows at the top of the movement",
      "Slowly lower the dumbbells back to shoulder height with control",
      "Repeat while maintaining proper posture throughout",
    ],
    inclined_dumbbell_press: [
      "Sit on an inclined bench at about 45-60 degrees",
      "Keep your feet flat on the floor and core engaged",
      "Hold dumbbells at shoulder level with palms facing forward",
      "Press the dumbbells upward until arms are extended (avoid locking elbows)",
      "Maintain a slight arch in your back and keep shoulders retracted",
      "Lower weights with control back to starting position",
      "Keep your neck in a neutral position aligned with your spine"
    ]
  };

  // Exercise icons mapping
  const exerciseIcons = {
    squat: "🏋️",
    bulgarian_squat: "🦵",
    seated_shoulder_press: "🧍‍♂️🏋️",
    inclined_dumbbell_press: "📐"
  };

  // Draw the initial canvas message
  useEffect(() => {
    if (!canvasRef.current) return;
    drawInitialMessage();
  }, []);

  const drawInitialMessage = () => {
    if (!canvasRef.current) return;
    const canvasCtx = canvasRef.current.getContext("2d");
    canvasCtx.fillStyle = "#f3f4f6"; // bg-gray-100 color
    canvasCtx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    canvasCtx.font = "bold 24px Arial";
    canvasCtx.fillStyle = "#1e3a8a"; // blue-900
    canvasCtx.textAlign = "center";
    canvasCtx.fillText(
      "Press Start Analyzing",
      canvasRef.current.width / 2,
      canvasRef.current.height / 2
    );
  };

  // Handle exercise change
  const changeExercise = (newExercise) => {
    if (isAnalyzing) {
      // Stop analysis and clear feedback if switching exercises
      setIsAnalyzing(false);
      setFeedback("");
      drawInitialMessage();
      setAnalyzerKey(Date.now());
    }
    setExercise(newExercise);
  };

  // Start pose analysis when button is clicked
  const startAnalyzing = () => {
    setIsAnalyzing(true);
  };

  const stopAnalysing=()=>{
    setIsAnalyzing(false);
    setFeedback("");
    drawInitialMessage();
    setAnalyzerKey(Date.now());
  }

  useEffect(() => {
    if (!isAnalyzing) return;
    // Get MediaPipe components from window (assumed to be loaded)
    const Pose = window.Pose;
    const Camera = window.Camera;
    const drawingUtils = window;
    if (!videoRef.current || !canvasRef.current) return;

    // Create new Pose instance and store it in ref
    poseRef.current = new Pose({
      locateFile: (file) => {
        // if file name indicates a simd version, swap it out for the non-simd version
        if (file.includes('simd')) {
          return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/pose_solution_wasm_bin.js`;
        }
        return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
      },
    });

    poseRef.current.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      enableSegmentation: false,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    poseRef.current.onResults(onResults);

    // Create new Camera instance and store it in ref
    cameraRef.current = new Camera(videoRef.current, {
      onFrame: async () => {
        if (poseRef.current) {
          await poseRef.current.send({ image: videoRef.current });
        }
      },
      width: 640,
      height: 480,
    });
    cameraRef.current.start();

    function onResults(results) {
      const canvasCtx = canvasRef.current.getContext("2d");
      canvasCtx.save();
      canvasCtx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      canvasCtx.drawImage(
        results.image,
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );

      if (results.poseLandmarks) {
        drawingUtils.drawConnectors(
          canvasCtx,
          results.poseLandmarks,
          POSE_CONNECTIONS.POSE_CONNECTIONS,
          {
            color: "red",
            lineWidth: 1,
          }
        );
        drawingUtils.drawLandmarks(canvasCtx, results.poseLandmarks, {
          color: "white",
          lineWidth: 0.5,
        });

        // Pass setFeedback so analyzePose can update the state
        analyzePose(exercise, results.poseLandmarks, setFeedback);
      }
      canvasCtx.restore();
    }

    // Cleanup function when isAnalyzing changes or component unmounts
    return () => {
      if (cameraRef.current) {
        cameraRef.current.stop();
        cameraRef.current = null;
      }
      if (poseRef.current) {
        poseRef.current.close();
        poseRef.current = null;
      }
    };
  }, [exercise, isAnalyzing]);

  return (
    <div className="h-screen flex bg-gray-100">
      {/* Left Sidebar */}
      <div className="w-64 bg-blue-900 text-white p-4 flex flex-col">
        <div className="mb-8">
          <h1 className="text-xl font-bold text-white">FitForm</h1>
          <p className="text-xs text-blue-200">AI Pose Analyzer</p>
        </div>

        <div className="flex-1">
          <p className="text-xs uppercase text-blue-300 mb-2 font-semibold">
            Select Exercise
          </p>

          {/* Exercise Options */}
          {Object.keys(exerciseSteps).map((ex) => (
            <div
              key={ex}
              className={`${
                exercise === ex
                  ? "bg-blue-800"
                  : "bg-blue-950 hover:bg-blue-800"
              } rounded p-3 flex items-center mb-2 cursor-pointer transition-colors`}
              onClick={() => changeExercise(ex)}
            >
              <span className="mr-2 text-yellow-400">{exerciseIcons[ex]}</span>
              <span className="text-sm capitalize">{ex}</span>
              {exercise === ex && (
                <span className="ml-auto w-2 h-2 bg-yellow-400 rounded-full"></span>
              )}
            </div>
          ))}

          <div className="mt-auto pt-4">
            <p className="text-xs text-blue-300">
              Select an exercise and press START to begin analysis
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white p-4 border-b text-center">
          <h1 className="text-xl font-bold text-gray-800">
            {exercise.charAt(0).toUpperCase() + exercise.slice(1)} Form Checker
          </h1>
          <p className="text-sm text-gray-500">
            Real-time form analysis with AI-powered feedback
          </p>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-4 flex flex-col items-center">
          {/* Video Display - Centered */}
          <div className="relative w-full max-w-xl h-96 mb-4 rounded overflow-hidden shadow mx-auto">
            <video
              ref={videoRef}
              className="hidden"
              autoPlay
              playsInline
              muted
              width="640"
              height="480"
            />
            <canvas
              ref={canvasRef}
              className="w-full h-full object-cover"
              width="640"
              height="480"
            />

            <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white text-xs px-3 py-1 rounded-full">
              {isAnalyzing ? "ANALYZING" : "READY"}
            </div>
          </div>

          {/* Feedback Section */}
          <div className="p-2 rounded shadow bg-white w-full max-w-xl mb-4">
            <p className="text-lg font-semibold">Feedback:</p>

            <p className="whitespace-pre-line">{feedback || "Start analyzing to get feedback"}</p>
          </div>

          {/* Start Button */}
          <button
            className={`${
              isAnalyzing
                ? "bg-red-500 hover:bg-red-600"
                : "bg-green-500 hover:bg-green-600"
            } text-white font-medium py-2 px-6 rounded-full mb-4`}
            onClick={() => {
              if (isAnalyzing) {
               stopAnalysing();
              } else {
                startAnalyzing();
              }
            }}
          >
            {isAnalyzing ? "STOP ANALYZING" : "START ANALYZING"}
          </button>

          {/* Exercise Steps Section */}
          <div className="w-full max-w-2xl">
            <h3 className="text-center text-gray-700 mb-3">
              How to perform {exercise} correctly:
            </h3>

            <div className="grid grid-cols-3 gap-2">
              {exerciseSteps[exercise].map((step, index) => (
                <div key={index} className="bg-white rounded shadow p-3">
                  <div className="flex items-center mb-1">
                    <span className="bg-blue-800 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-2">
                      {index + 1}
                    </span>
                    <span className="font-medium text-sm">Step {index + 1}</span>
                  </div>
                  <p className="text-xs text-gray-700">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
