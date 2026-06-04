import { useState } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import QRCode from "react-native-qrcode-svg";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useRef } from "react";
import { db } from "../../firebase";
import { ref, set, get, update } from "firebase/database";
import { useEffect } from "react";
import { onValue } from "firebase/database";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
export default function HomeScreen() {
  const [sessionId, setSessionId] = useState("");

  const [permission, requestPermission] = useCameraPermissions();

  const [plasticCount, setPlasticCount] = useState(0);
  const [metalCount, setMetalCount] = useState(0);
  const [showCamera, setShowCamera] = useState(false);
  const cameraRef = useRef<any>(null);
  const startSession = async () => {
    const id = "session_" + Date.now();

    await set(ref(db, "sessions/" + id), {
      status: "active",
      plasticCount: 0,
      metalCount: 0,
      createdAt: new Date().toISOString(),    
    });
    await set(ref(db, "activeSession"), id);

    setSessionId(id);
    setPlasticCount(0);
    setMetalCount(0);
  };

  const addPlastic = async () => {
    const snapshot = await get(ref(db, "sessions/" + sessionId));
    const data = snapshot.val();

    const newCount = (data.plasticCount || 0) + 1;

    await update(ref(db, "sessions/" + sessionId), {
      plasticCount: newCount,
    });

    setPlasticCount(newCount);
  };

  const addCan = async () => {
    const snapshot = await get(ref(db, "sessions/" + sessionId));
    const data = snapshot.val();

    const newCount = (data.metalCount || 0) + 1;

    await update(ref(db, "sessions/" + sessionId), {
      metalCount: newCount,
    });

    setMetalCount(newCount);
  };
 const takePicture = async () => {
  try {
    if (!cameraRef.current) return;

    const photo = await cameraRef.current.takePictureAsync();

    console.log("PHOTO:", photo.uri);

    const targetPath =
      FileSystem.documentDirectory + "input.jpg";

    await FileSystem.copyAsync({
      from: photo.uri,
      to: targetPath,
    });

    console.log("COPIED TO:", targetPath);

    setShowCamera(false);

    // wait for UI to finish updating
    setTimeout(async () => {
      try {
        await Sharing.shareAsync(targetPath);
      } catch (e) {
        console.log("SHARE ERROR:", e);
      }
    }, 500);

  } catch (err) {
    console.log("CAMERA ERROR:", err);
  }
};
  const endSession = async () => {
    if (!sessionId) return;
await update(ref(db, "sessions/" + sessionId), {
  status: "completed",
});

await set(ref(db, "activeSession"), null);
    setSessionId("");
    setPlasticCount(0);
    setMetalCount(0);
  };
useEffect(() => {
  if (!sessionId) return;

  const sessionRef =
    ref(db, "sessions/" + sessionId);

  const unsubscribe = onValue(
    sessionRef,
    (snapshot) => {
      const data = snapshot.val();

      if (!data) return;

      setPlasticCount(
        data.plasticCount || 0
      );

      setMetalCount(
        data.metalCount || 0
      );
    }
  );

  return () => unsubscribe();
}, [sessionId]);
  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Button
          title="Grant Camera Permission"
          onPress={requestPermission}
        />
      </View>
    );
  }
  if (showCamera) {
  return (
    <View style={{ flex: 1 }}>
      <CameraView
        ref={cameraRef}
        style={{ flex: 1 }}
        facing="back"
      />

      <Button
        title="Take Picture"
        onPress={takePicture}
      />
      <Button
      title="Cancel"
      onPress={() => setShowCamera(false)}
    />
    </View>
    
  );
}

  return (
    <View style={styles.container}>
      <Text style={styles.title}>♻️ SMART RECYCLE BIN</Text>

      {!sessionId ? (
        <Button
          title="Start Session"
          onPress={startSession}
        />
      ) : (
        <>
          <Text style={styles.session}>{sessionId}</Text>

          <QRCode
            value={sessionId}
            size={180}
          />

          <View style={{ height: 20 }} />

          <Text style={styles.counter}>
            Plastic: {plasticCount}
          </Text>

          <Text style={styles.counter}>
            Can: {metalCount}
          </Text>

          <View style={{ height: 20 }} />

          <Button
            title="Capture Image"
            onPress={() => setShowCamera(true)}
          />
          <View style={{ height: 10 }} />

          <Button
            title="+ Plastic"
            onPress={addPlastic}
          />

          <View style={{ height: 10 }} />

          <Button
            title="+ Can"
            onPress={addCan}
          />

          <View style={{ height: 10 }} />

          <Button
            title="End Session"
            onPress={endSession}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
  },

  session: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },

  counter: {
    fontSize: 18,
    marginVertical: 2,
  },
});