import axios from "axios";
import config from "../consts/ConfigUrl";

const viewLogs = true,
  myApiUrl = `api/usuario/`;

export const signInWs = async (username: string, password_u: string) => {
  const url = `${config.api}${myApiUrl}authenticate`;
  if (viewLogs) console.log("URL SignIn: ", url, { username, password_u });

  try {
    const res = await axios.post(url, { username, password_u });
    localStorage.setItem("auth", res.data.accessToken);
    localStorage.setItem("sign-out", JSON.stringify(false));
    return { success: true };
  } catch (error) {
    localStorage.clear();
    let errorMessage = "Se presentó un error";
    if (error.response.data.message === "Usuario no encontrado") {
      errorMessage = "Usuario no encontrado";
    } else if (error.response.data.message === "Contraseña incorrecta") {
      errorMessage = "Contraseña incorrecta";
    }
    return { success: false, errorMessage };
  }
};
