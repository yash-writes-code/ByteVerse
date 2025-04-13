export function analyzePose(exercise, landmarks,func) {
  let feedback = "";

  if (exercise === "squat") {
    const hip = landmarks[24]; // right hip
    const knee = landmarks[26]; // right knee
    const ankle = landmarks[28]; // right ankle

    if (hip && knee && ankle) {
      const angle = getAngle(hip, knee, ankle);
      if (angle < 90) {
        feedback ="Great! You are squatting deep enough.";
      } else {
        feedback = "Go lower! Try to get your hips closer to your knees.";
      }
    }
  }
  else if(exercise == "seated_shoulder_press"){
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
      func("Start Position Detected");
    } else if (angle_l >= 165 && angle_l <= 185 && angle_r >= 165 && angle_r <= 185) {
      func("End Position Good");
    }

    // if (back_angle < 75) {
    //   func("Back arching too much — sit upright");
    // }

    if (Math.abs(shoulder_x_avg - hip_x_avg) > 0.05) {
      func("Chest flared. Keep back flat on bench");
    }

    if (angle_l < 70 || angle_r < 70) {
      func("Elbows too close (angle < 70°)");
    }

    if (angle_l > 190 || angle_r > 190) {
      func("Elbows overextended (angle > 190°)");
    }

    // if (Math.abs(nose_x - shoulder_x_avg) > 0.03) {
    //   func("Head too far forward. Align with spine");
    // }

    const dist_l = Math.abs(l_wrist.x - l_shoulder.x);
    const dist_r = Math.abs(r_wrist.x - r_shoulder.x);
    if (dist_l < 0.05 || dist_r < 0.05) {
      func("Dumbbells too close to shoulders. Flare out elbows");
    }

    if (l_elbow.y > l_shoulder.y + 0.05 || r_elbow.y > r_shoulder.y + 0.05) {
      func("Elbows too low. Lift to shoulder height");
    }

   
  }

  return feedback;
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

