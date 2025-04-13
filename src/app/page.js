"use client"
import { useEffect, useRef, useState } from 'react';
import POSE_CONNECTIONS from '@mediapipe/pose';
import { analyzePose } from '@/utils/Analysze';

export default function Home() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [exercise, setExercise] = useState('seated_shoulder_press');
  const [feedback, setFeedback] = useState('');
  const [connectionError, setConnectionError] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const exerciseSteps = {
    squat: [
      "Stand with feet shoulder-width apart",
      "Keep your back straight and chest up",
      "Lower your body by bending knees and pushing hips back",
      "Keep knees in line with toes, not extending past them",
      "Go as deep as comfortable, ideally until thighs are parallel to ground",
      "Push through heels to return to starting position"
    ],
    bulgarian_squat: [
      "Stand a few feet in front of a bench or step",
      "Place one foot behind you on the bench with laces down",
      "Keep your front foot flat and torso upright",
      "Lower your body until your front thigh is parallel to the floor",
      "Make sure front knee stays in line with your ankle",
      "Push through the front heel to return to starting position"
    ],
    seated_shoulder_press: [
      "Sit on a bench with back support and hold dumbbells at shoulder height",
      "Keep your feet flat on the floor and core engaged",
      "Press the dumbbells upward until your arms are fully extended",
      "Avoid locking your elbows at the top of the movement",
      "Slowly lower the dumbbells back to shoulder height with control",
      "Repeat while maintaining proper posture throughout"
    ]
  };

  // Exercise icons mapping
  const exerciseIcons = {
    squat: "🏋️",
    bulgarian_squat: "🦵",
    seated_shoulder_press: "🧍‍♂️🏋️‍♂️"
  };

  // Draw the initial canvas message
  useEffect(() => {
    if (!canvasRef.current) return;
    drawInitialMessage();
  }, []);

  const drawInitialMessage = () => {
    if (!canvasRef.current) return;
    const canvasCtx = canvasRef.current.getContext('2d');
    canvasCtx.fillStyle = "#f3f4f6"; // bg-gray-100 color
    canvasCtx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    
    canvasCtx.font = "bold 24px Arial";
    canvasCtx.fillStyle = "#1e3a8a"; // blue-900
    canvasCtx.textAlign = "center";
    canvasCtx.fillText("Press Start Analyzing", canvasRef.current.width / 2, canvasRef.current.height / 2);
  };

  // Handle exercise change
  const changeExercise = (newExercise) => {
    if (isAnalyzing) {
      setIsAnalyzing(false);
      setFeedback('');
      drawInitialMessage();
    }
    setExercise(newExercise);
  };

  // Start pose analysis when button is clicked
  const startAnalyzing = () => {
    setIsAnalyzing(true);
  };

  useEffect(() => {
    if (!isAnalyzing) return;
    
    const Pose = window.Pose;
    const Camera = window.Camera;
    const drawingUtils = window;

    if (!videoRef.current || !canvasRef.current) return;

    const pose = new Pose({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
    });

    pose.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      enableSegmentation: false,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    pose.onResults(onResults);

    const camera = new Camera(videoRef.current, {
      onFrame: async () => {
        await pose.send({ image: videoRef.current });
      },
      width: 640,
      height: 480,
    });
    camera.start();

    function onResults(results) {
      const canvasCtx = canvasRef.current.getContext('2d');
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
        drawingUtils.drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS.POSE_CONNECTIONS, {
          color: 'red',
          lineWidth: 1,
        });
        drawingUtils.drawLandmarks(canvasCtx, results.poseLandmarks, {
          color: 'white',
          lineWidth: 0.5,
        });

        analyzePose(exercise,results.poseLandmarks,setFeedback);
      }
      canvasCtx.restore();
    }

   
   

    return () => {
      try {
        camera.stop();
        setTimeout(() => {
          pose.close();
        }, 100);
      } catch (error) {
        console.error("Error during cleanup:", error);
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
          <p className="text-xs uppercase text-blue-300 mb-2 font-semibold">Select Exercise</p>
          
          {/* Exercise Options */}
          {Object.keys(exerciseSteps).map((ex) => (
            <div 
              key={ex}
              className={`${exercise === ex ? 'bg-blue-800' : 'bg-blue-950 hover:bg-blue-800'} rounded p-3 flex items-center mb-2 cursor-pointer transition-colors`}
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
            <p className="text-xs text-blue-300">Select an exercise and press START to begin analysis</p>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white p-4 border-b text-center">
          <h1 className="text-xl font-bold text-gray-800">{exercise.charAt(0).toUpperCase() + exercise.slice(1)} Form Checker</h1>
          <p className="text-sm text-gray-500">Real-time form analysis with AI-powered feedback</p>
        </div>
        
        {/* Content Area */}
        <div className="flex-1 p-4 flex flex-col items-center">
          {/* Video Display - Centered */}
          <div className="relative w-full max-w-xl h-96 mb-4 rounded overflow-hidden shadow mx-auto">
            <video ref={videoRef} className="hidden" autoPlay playsInline muted width="640" height="480" />
            <canvas ref={canvasRef} className="w-full h-full object-cover" width="640" height="480" />
            
            <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white text-xs px-3 py-1 rounded-full">
              {isAnalyzing ? "ANALYZING" : "READY"}
            </div>
          </div>
          
          {/* Feedback Section */}
          <div className="p-2 rounded shadow bg-white w-full max-w-xl mb-4">
            <p className="text-lg font-semibold">Feedback:</p>
            <p>{feedback || "Start analyzing to get feedback"}</p>
          </div>
          
          {/* Start Button - Reduced Width */}
          <button 
            className={`${isAnalyzing ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'} text-white font-medium py-2 px-6 rounded-full mb-4`}
            onClick={() => {
              if (isAnalyzing) {
                setIsAnalyzing(false);
                setFeedback('');
                drawInitialMessage();
              } else {
                startAnalyzing();
              }
            }}
          >
            {isAnalyzing ? "STOP ANALYZING" : "START ANALYZING"}
          </button>
          
          {/* Exercise Steps Section - Horizontal Layout */}
          <div className="w-full max-w-2xl">
            <h3 className="text-center text-gray-700 mb-3">
              How to perform {exercise} correctly:
            </h3>
            
            <div className="grid grid-cols-3 gap-2">
              {exerciseSteps[exercise].map((step, index) => (
                <div key={index} className="bg-white rounded shadow p-3">
                  <div className="flex items-center mb-1">
                    <span className="bg-blue-800 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-2">{index + 1}</span>
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