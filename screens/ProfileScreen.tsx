import { useEffect, useState } from "react";
import { View, TextInput, Button, Image, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { supabase } from "../lib/supabase";

export default function ProfileScreen({ navigation }: any) {
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [foto, setFoto] = useState("");
  const [loading, setLoading] = useState(true);

  const [savedProfile, setSavedProfile] = useState<any>(null);

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigation.replace("Login");
      return;
    }

    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (data) {
      setNome(data.nome || "");
      setDescricao(data.descricao || "");
      setFoto(data.foto_url || "");
    }
    setLoading(false);
  }

  async function updateProfile() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from("profiles").upsert({
      id: user.id,
      nome,
      descricao,
      foto_url: foto,
    });

    setSavedProfile({ nome, descricao, foto_url: foto });
  }

  async function pickImage() {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setFoto(uri);
    }
  }

  if (loading) return <Text style={styles.loading}>Carregando...</Text>;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Editar Perfil</Text>

      {foto ? <Image source={{ uri: foto }} style={styles.avatar} /> : null}

      <TouchableOpacity onPress={pickImage} style={styles.pickButton}>
        <Text style={styles.pickButtonText}>Escolher Foto</Text>
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        placeholder="Nome"
        value={nome}
        onChangeText={setNome}
      />
      <TextInput
        style={[styles.input, { height: 80 }]}
        placeholder="Descrição"
        value={descricao}
        onChangeText={setDescricao}
        multiline
      />

      <TouchableOpacity onPress={updateProfile} style={styles.saveButton}>
        <Text style={styles.saveButtonText}>Salvar</Text>
      </TouchableOpacity>

      {/* Mini card */}
      {savedProfile && (
        <View style={styles.card}>
          {savedProfile.foto_url ? (
            <Image source={{ uri: savedProfile.foto_url }} style={styles.cardAvatar} />
          ) : null}
          <Text style={styles.cardNome}>{savedProfile.nome}</Text>
          <Text style={styles.cardDescricao}>{savedProfile.descricao}</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  loading: {
    flex: 1,
    textAlign: "center",
    marginTop: 50,
    fontSize: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 15,
  },
  pickButton: {
    backgroundColor: "#6c5ce7",
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 25,
    marginBottom: 20,
  },
  pickButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
    textAlignVertical: "top",
  },
  saveButton: {
    backgroundColor: "#00b894",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginBottom: 20,
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  card: {
    width: "100%",
    padding: 20,
    borderRadius: 15,
    backgroundColor: "#f1f2f6",
    alignItems: "center",
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 5,
  },
  cardAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  cardNome: { fontWeight: "bold", fontSize: 20, marginBottom: 5 },
  cardDescricao: { fontSize: 14, color: "#555", textAlign: "center" },
});
