import { useEffect, useState } from "react";
import { View, TextInput, Button, Image, Text, StyleSheet } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { supabase } from "../lib/supabase";

export default function ProfileScreen({ navigation }: any) {
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [foto, setFoto] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigation.replace("Login");
      return;
    }

    const { data, error } = await supabase
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

    alert("Perfil atualizado!");
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
      //
    }
  }

  if (loading) return <Text>Carregando...</Text>;

  return (
    <View style={styles.container}>
      <Text>Nome</Text>
      <TextInput style={styles.input} value={nome} onChangeText={setNome} />
      <Text>Descrição</Text>
      <TextInput
        style={styles.input}
        value={descricao}
        onChangeText={setDescricao}
      />
      {foto ? <Image source={{ uri: foto }} style={styles.image} /> : null}
      <Button title="Escolher Foto" onPress={pickImage} />
      <Button title="Salvar" onPress={updateProfile} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  image: { width: 100, height: 100, borderRadius: 50, marginBottom: 10 },
});
