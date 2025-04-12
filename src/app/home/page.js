"use client"
import { useEffect, useRef, useState } from 'react';
import POSE_CONNECTIONS  from '@mediapipe/pose';


export default function Home() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [exercise, setExercise] = useState('squat');
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
      const Pose = window.Pose;
      const  Camera = window.Camera;
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
          //console.log(POSE_CONNECTIONS);
          drawingUtils.drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS.POSE_CONNECTIONS, {
            color: 'red',
            lineWidth: 1,
          });
          drawingUtils.drawLandmarks(canvasCtx, results.poseLandmarks, {
            color: 'white',
            lineWidth: 0.5,
          });
  
          analyzePose(results.poseLandmarks);
        }
        canvasCtx.restore();
      }
  
      function analyzePose(landmarks) {
        if (exercise === 'squat') {
          const hip = landmarks[24]; // right hip
          const knee = landmarks[26]; // right knee
          const ankle = landmarks[28]; // right ankle
  
          if (hip && knee && ankle) {
            const angle = getAngle(hip, knee, ankle);
            if (angle < 90) {
              setFeedback('Great! You are squatting deep enough.');
            } else {
              setFeedback('Go lower! Try to get your hips closer to your knees.');
            }
          }
        }
      }
  
      function getAngle(a, b, c) {
        const ab = { x: a.x - b.x, y: a.y - b.y };
        const cb = { x: c.x - b.x, y: c.y - b.y };
        const dot = ab.x * cb.x + ab.y * cb.y;
        const magAB = Math.sqrt(ab.x * ab.x + ab.y * ab.y);
        const magCB = Math.sqrt(cb.x * cb.x + cb.y * cb.y);
        const angle = Math.acos(dot / (magAB * magCB));
        return (angle * 180) / Math.PI;
      }
  }, [exercise]);
  

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Pose Estimation for Exercises</h1>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Select Exercise</label>
        <select
          className="border p-2 rounded"
          value={exercise}
          onChange={(e) => setExercise(e.target.value)}
        >
          <option value="squat">Squat</option>
          {/* Add more exercises later */}
        </select>
      </div>

      <div className="mb-4">
        <video ref={videoRef} className="hidden" autoPlay playsInline muted width="640" height="480" />
        <canvas ref={canvasRef} className="border" width="640" height="480" />
      </div>

      <div className="p-2  rounded shadow">
        <p className="text-lg font-semibold">Feedback:</p>
        <p>{feedback}</p>
      </div>
    </div>
  );
}
