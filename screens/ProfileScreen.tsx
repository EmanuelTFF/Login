import { useEffect, useState } from "react";
import { View, TextInput, Image, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { supabase } from "../lib/supabase";

export default function ProfileScreen({ navigation }: any) {
  // Estados do formulário
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [foto, setFoto] = useState(""); // guarda a URL da foto do perfil
  const [loading, setLoading] = useState(true);

  // Guarda o perfil já salvo (para mostrar no "mini card")
  const [savedProfile, setSavedProfile] = useState<any>(null);

  //  Executa quando o componente carrega
  useEffect(() => {
    loadProfile(); // busca dados do usuário no Supabase
  }, []);

  //  Busca o perfil do usuário logado no Supabase
  async function loadProfile() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      // se não estiver logado, manda para a tela de login
      navigation.replace("Login");
      return;
    }

    // busca os dados do usuário na tabela "profiles"
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

  //  Atualiza ou insere o perfil no banco (upsert = update ou insert)
  async function updateProfile() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from("profiles").upsert({
      id: user.id,
      nome,
      descricao,
      foto_url: foto,
    });

    // atualiza o estado para mostrar o mini card atualizado
    setSavedProfile({ nome, descricao, foto_url: foto });
  }

  // Abre a galeria para escolher uma foto
  async function pickImage() {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      // pega o caminho da imagem escolhida
      const uri = result.assets[0].uri;
      setFoto(uri); // salva no estado (ainda não salva no banco)
    }
  }

  // Remove a foto do perfil (limpa no banco e no estado)
  async function removePhoto() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // seta o campo foto_url como null no banco
    await supabase.from("profiles").update({
      foto_url: null,
    }).eq("id", user.id);

    // limpa o estado local
    setFoto("");
    setSavedProfile((prev: any) => prev ? { ...prev, foto_url: "" } : null);
  }


  if (loading) return <Text style={styles.loading}>Carregando...</Text>;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Editar Perfil</Text>


      {foto ? <Image source={{ uri: foto }} style={styles.avatar} /> : null}


      <TouchableOpacity onPress={pickImage} style={styles.pickButton}>
        <Text style={styles.pickButtonText}>Escolher Foto</Text>
      </TouchableOpacity>


      {foto ? (
        <TouchableOpacity onPress={removePhoto} style={[styles.pickButton, { backgroundColor: "#d63031" }]}>
          <Text style={styles.pickButtonText}>Remover Foto</Text>
        </TouchableOpacity>
      ) : null}


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
