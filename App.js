import { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { supabase } from "./lib/supabase";

import LoginScreen from "./screens/LoginScreen";
import SignupScreen from "./screens/SignupScreen";
import ProfileScreen from "./screens/ProfileScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  // Estado que guarda a sessão do usuário (null se não estiver logado)
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true); // controla o carregamento inicial

  useEffect(() => {
    //  Verifica se já existe uma sessão salva no Supabase (usuário logado)
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session); // atualiza o estado da sessão
      setLoading(false);   // terminou de carregar
    });

    //  Listener que detecta mudanças na autenticação (login/logout)
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session); // atualiza a sessão automaticamente
      }
    );

    // Cleanup do listener quando o componente desmonta
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  //  Enquanto estiver carregando a sessão inicial, não renderiza nada
  if (loading) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {session ? (
          // Se houver sessão, vai direto para o ProfileScreen
          <Stack.Screen name="Profile" component={ProfileScreen} />
        ) : (
          // Se não estiver logado, mostra Login e Signup
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
