export function analyzePose(exercise, landmarks,setFeedback) {
  

  if (exercise === "squat") {
    const hip = landmarks[24]; // right hip
    const knee = landmarks[26]; // right knee
    const ankle = landmarks[28]; // right ankle

    let feedback_items=[]

    if (hip && knee && ankle) {
      const angle = getAngle(hip, knee, ankle);
      if (angle < 90) {
        feedback_items.push("Great! You are squatting deep enough.");
      } else {
        feedback_items.push("Go lower! Try to get your hips closer to your knees.");
      }
    }
    setFeedback(feedback_items.join("\n"));
  }
  else if(exercise == "seated_shoulder_press"){
    feedback_items=[]
    const l_shoulder = landmarks[11];
    const l_elbow = landmarks[13];
    const l_wrist = landmarks[15];

    const r_shoulder = landmarks[12];
    const r_elbow = landmarks[14];
    const r_wrist = landmarks[16];

    const l_hip = landmarks[23];
    const r_hip = landmarks[24];
    const nose = landmarks[0];

    // Back angle check (shoulder-hip alignment vs vertical)
    //const back_angle = getAngle(r_shoulder, r_hip, [r_shoulder[0], r_hip[1]]);

    const shoulder_x_avg = (l_shoulder.x + r_shoulder.x) / 2;
    const hip_x_avg = (l_hip.x + r_hip.x) / 2;
    const nose_x = nose.x;
    // console.log(l_shoulder);
    // console.log(shoulder_x_avg);

    const angle_l = getAngle(l_shoulder, l_elbow, l_wrist);
    const angle_r = getAngle(r_shoulder, r_elbow, r_wrist);

    const shoulder_angle_l = getAngle(l_elbow, l_shoulder, l_hip);
    const shoulder_angle_r = getAngle(r_elbow, r_shoulder, r_hip);

    // Posture Feedback
    if (angle_l >= 80 && angle_l <= 100 && angle_r >= 80 && angle_r <= 100) {
      feedback_items.push("Start Position Detected");
    } else if (angle_l >= 165 && angle_l <= 185 && angle_r >= 165 && angle_r <= 185) {
      feedback_items.push("End Position Good");
    }

    // if (back_angle < 75) {
    //   setFeedback("Back arching too much — sit upright");
    // }

    if (Math.abs(shoulder_x_avg - hip_x_avg) > 0.05) {
      feedback_items.push("Chest flared. Keep back flat on bench");
    }

    if (angle_l < 70 || angle_r < 70) {
      feedback_items.push("Elbows too close (angle < 70°)");
    }

    if (angle_l > 190 || angle_r > 190) {
      feedback_items.push("Elbows overextended (angle > 190°)");
    }

    // if (Math.abs(nose_x - shoulder_x_avg) > 0.03) {
    //   setFeedback("Head too far forward. Align with spine");
    // }

    const dist_l = Math.abs(l_wrist.x - l_shoulder.x);
    const dist_r = Math.abs(r_wrist.x - r_shoulder.x);
    if (dist_l < 0.05 || dist_r < 0.05) {
      feedback_items.push("Dumbbells too close to shoulders. Flare out elbows");
    }

    if (l_elbow.y > l_shoulder.y + 0.05 || r_elbow.y > r_shoulder.y + 0.05) {
      feedback_items.push("Elbows too low. Lift to shoulder height");
    }

    setFeedback(feedback_items.join("\n"));
  }
  else if (exercise == "tricep_pushdown") {
    const l_shoulder = landmarks[11];
    const l_elbow = landmarks[13];
    const l_wrist = landmarks[15];
    const l_hip = landmarks[23];
    const l_ear = landmarks[7];
  
    const feedback = [];
  
    if (l_shoulder.y < l_hip.y && Math.abs(l_shoulder.x - l_hip.x) < 0.15) {
        feedback.push("✅ Neutral spine");
      } else {
        feedback.push("❌ Lean slightly forward");
      }
      
      // Elbow stable
      if (Math.abs(l_elbow.x - l_shoulder.x) < 0.018) {
        feedback.push("✅ Elbow stable");
      } else {
        feedback.push("❌ Don't swing elbows forward");
      }
      
      // Shoulder stable
      if (l_shoulder.y > l_ear.y) {
        feedback.push("✅ Shoulders stable");
      } else {
        feedback.push("❌ Don't shrug shoulders");
      }
      
      // Arm extension
      const angle = getAngle(l_shoulder, l_elbow, l_wrist);
      if (angle > 160) {
        feedback.push("✅ Good arm extension");
      } else {
        feedback.push("❌ Extend your arms fully");
      }
    setFeedback(feedback.join("\n"));
  }
  
  else if(exercise == "inclined_dumbbell_press"){

    const TOLERANCE = 10;
        
    // Get required landmarks
    const leftShoulder = landmarks[11]; // LEFT_SHOULDER
    const rightShoulder = landmarks[12]; // RIGHT_SHOULDER
    const leftHip = landmarks[23]; // LEFT_HIP
    const rightHip = landmarks[24]; // RIGHT_HIP
    const leftKnee = landmarks[25]; // LEFT_KNEE
    const rightKnee = landmarks[26]; // RIGHT_KNEE
    const leftAnkle = landmarks[27]; // LEFT_ANKLE
    const rightAnkle = landmarks[28]; // RIGHT_ANKLE
    const nose = landmarks[0]; // NOSE
    
    // Check if we have all necessary landmarks
    if (leftShoulder && leftHip && leftKnee && leftAnkle && nose) {
      // Create an array to collect feedback
      let feedbackItems = [];
      
      // Check back arch
      const backAngle = getAngle(
        [leftShoulder.x, leftShoulder.y],
        [leftHip.x, leftHip.y],
        [leftKnee.x, leftKnee.y]
      );
      
      if (backAngle < (150 + TOLERANCE)) {
        feedbackItems.push("✅ Good back arch.");
      } else {
        feedbackItems.push("❌ Arch your back slightly.");
      }
      
      // Check if shoulders are retracted
      if (leftShoulder.x < leftHip.x) {
        feedbackItems.push("✅ Shoulders properly retracted.");
      } else {
        feedbackItems.push("❌ Pull your shoulders back (retract).");
      }
      
      // Check if feet are under knees
      if (Math.abs(leftKnee.x - leftAnkle.x) < 0.1) {
        feedbackItems.push("✅ Stable foot position.");
      } else {
        feedbackItems.push("❌ Position feet under knees for stability.");
      }
      
      // Check neck position
      if (Math.abs(nose.y - leftShoulder.y) < 0.1) {
        feedbackItems.push("✅ Neutral neck position.");
      } else {
        feedbackItems.push("❌ Align your neck with your chest.");
      }
      
      // Combine all feedback
      setFeedback(feedbackItems.join("\n"));
    }
    else if(exercise == "bulgarian_squat"){
        const hip = landmarks[23]; // left hip
        const knee = landmarks[25]; // left knee
        const ankle = landmarks[27]; // left ankle
        
        // console.log("Bulgarian Squat Analysis");
        // console.log("Hip landmark:", hip);
        // console.log("Knee landmark:", knee);
        // console.log("Ankle landmark:", ankle);
        feedback_items =[];

        if (hip && knee && ankle) {
          const angle = getAngle(hip, knee, ankle);
          console.log("Calculated angle:", angle);
          

          if (angle >= 70 && angle <= 100) {
            console.log("Setting feedback: Good depth!");
            feedback_items.push('✅ Good depth! Solid Bulgarian Split Squat.');
          } else if (angle < 70) {
            console.log("Setting feedback: Too deep!");
            feedback_items.push('❌ Too deep! Raise yourself slightly.');
          } else if (angle > 100) {
            console.log("Setting feedback: Too shallow!");
            feedback_items.push('❌ Too shallow! Bend your knee more.');
          } else {
            console.log("Setting feedback: Unable to detect angle.");
            feedback_items.push('🤔 Unable to detect knee angle.');
          }
        } else {
          console.log("Missing landmarks for Bulgarian squat analysis");
          setFeedback('Cannot detect body landmarks. Please ensure your full body is visible.');
        }
        setFeedback(feedbackItems.join("\n"));
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

