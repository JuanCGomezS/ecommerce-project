import { useContext, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCartContext } from "../../Context";
import Layout from "../../Components/Layout";
import { signInWs, permissionsWs } from "../../services/AuthService";
import MessageContainer from "../../Components/Message/MessageContainer";
import { messages } from "../../consts/Utilities";
import { jwtDecode } from 'jwt-decode';

function SignIn() {
  const context = useContext(ShoppingCartContext);
  const [view, setView] = useState("user-info");
  const form = useRef(null);
  const navigate = useNavigate();

  const account = localStorage.getItem("account");
  const parsedAccount = JSON.parse(account);
  const noAccountInLocalStorage = parsedAccount
    ? Object.keys(parsedAccount).length === 0
    : true;
  const noAccountInLocalState = context.account
    ? Object.keys(context.account).length === 0
    : true;
  const hasUserAnAccount = !noAccountInLocalStorage || !noAccountInLocalState;

  const messageContainerRef = useRef(null);
  const showMessage = (type, text) => {
    if (messageContainerRef.current) {
      messageContainerRef.current.addMessage(type, text);
    } else {
      console.log("messageContainerRef.current is null");
    }
  };

  const handleSignIn = async (event) => {
    event.preventDefault();

    const formData = new FormData(form.current);

    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
    };

    if (data.name === "" || data.password === "") {
      showMessage("warning", messages.errorCredenciales);
      return;
    }

    try {
      const response = await signInWs(data.email, data.password);

      if (response.success) {
        localStorage.setItem("auth", response.token);
        context.setSignOut(false);
        const decodedToken = jwtDecode(response.token);
        const permissions = await permissionsWs(decodedToken.rol);
        data.name = `${decodedToken.nombre} ${decodedToken.apellido}`;
        context.setAccount(data);
        context.setPermissions(permissions); 

        showMessage("success", `${messages.welcome} ${decodedToken.nombre} ${decodedToken.apellido}` );
        setTimeout(() => {
          navigate("/");
        }, 1000);
      } else {
        showMessage("error", messages.errorLogin);
      }
    } catch (error) {
      showMessage("error", messages.errorConexion);
    }
  };

  const createAnAccount = (event) => {
    event.preventDefault();
    handleSignIn(event);
  };

  const renderLogIn = () => {
    return (
      <form ref={form} className="flex flex-col gap-4 w-80" onSubmit={handleSignIn}>
        <div className="flex flex-col gap-1">
          <label htmlFor="email" className="font-light text-sm">
            Usuario:
          </label>
          <input
            type="text"
            id="email"
            name="email"
            defaultValue={parsedAccount?.email}
            placeholder="ejemplo@gmail.com"
            className="rounded-lg border border-black placeholder:font-light placeholder:text-sm placeholder:text-black/60 focus:outline-none py-2 px-4"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="password" className="font-light text-sm">
            Contraseña:
          </label>
          <input
            type="password"
            id="password"
            name="password"
            defaultValue={parsedAccount?.password}
            placeholder="******"
            className="rounded-lg border border-black placeholder:font-light placeholder:text-sm placeholder:text-black/60 focus:outline-none py-2 px-4"
          />
        </div>
        <button
          className="bg-black disabled:bg-black/40 text-white w-full rounded-lg py-3 mt-4 mb-2"
          type="submit"
        >
          Entrar
        </button>
        <div className="text-center">
          <a
            className="font-light text-xs underline underline-offset-4"
            href="/"
          >
            Olvide mi contraseña
          </a>
        </div>
        <button
          className="border border-black disabled:text-black/40 disabled:border-black/40 rounded-lg mt-6 py-3"
          onClick={() => setView("create-user-info")}
        >
          Registrarse
        </button>
      </form>
    );
  };

  const renderCreateUserInfo = () => {
    return (
      <form ref={form} className="flex flex-col gap-4 w-80" onSubmit={createAnAccount}>
        <div className="flex flex-col gap-1">
          <label htmlFor="name" className="font-light text-sm">
            Nombre:
          </label>
          <input
            type="text"
            id="name"
            name="name"
            defaultValue={parsedAccount?.name}
            placeholder="Peter"
            className="rounded-lg border border-black placeholder:font-light
            placeholder:text-sm placeholder:text-black/60 focus:outline-none py-2 px-4"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="email" className="font-light text-sm">
            Usuario:
          </label>
          <input
            type="text"
            id="email"
            name="email"
            defaultValue={parsedAccount?.email}
            placeholder="ejemplo@gmail.com"
            className="rounded-lg border border-black
            placeholder:font-light placeholder:text-sm placeholder:text-black/60 focus:outline-none py-2 px-4"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="password" className="font-light text-sm">
            Contraseña:
          </label>
          <input
            type="password"
            id="password"
            name="password"
            defaultValue={parsedAccount?.password}
            placeholder="******"
            className="rounded-lg border border-black
            placeholder:font-light placeholder:text-sm placeholder:text-black/60 focus:outline-none py-2 px-4"
          />
        </div>
        <button
          className="bg-black text-white w-full rounded-lg py-3"
          type="submit"
        >
          Create
        </button>
        <button className="border border-black disabled:text-black/40 disabled:border-black/40 rounded-lg mt-6 py-3 w-full">
          Cancelar
        </button>
      </form>
    );
  };

  const renderView = () =>
    view === "create-user-info" ? renderCreateUserInfo() : renderLogIn();

  return (
    <Layout>
      <h1 className="font-medium text-xl text-center mb-6 w-80">Bienvenido</h1>
      <MessageContainer ref={messageContainerRef} />
      {renderView()}
    </Layout>
  );
}

export default SignIn;
