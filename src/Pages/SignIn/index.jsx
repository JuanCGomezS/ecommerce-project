import { useContext, useState, useRef, useEffect } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { ShoppingCartContext } from "../../Context";
import Layout from "../../Components/Layout";
import { signInWs } from "../../services/AuthService";
import "../../utils/css/animations.css";

function SignIn() {
  const context = useContext(ShoppingCartContext);
  const [view, setView] = useState("user-info");

  const form = useRef(null);
  const navigate = useNavigate();

  // Account
  const account = localStorage.getItem("account");
  const parsedAccount = JSON.parse(account);
  // Has an account
  const noAccountInLocalStorage = parsedAccount
    ? Object.keys(parsedAccount).length === 0
    : true;
  const noAccountInLocalState = context.account
    ? Object.keys(context.account).length === 0
    : true;
  const hasUserAnAccount = !noAccountInLocalStorage || !noAccountInLocalState;
  //const [showMessage, setShowMessage] = useState(false);
  //const [isExiting, setIsExiting] = useState(false);

  // useEffect(() => {
  //   if (context.message) {
  //     setShowMessage(true);
  //     context.setMessage(context.message);
  //     setTimeout(() => {
  //       setIsExiting(true);
  //       setTimeout(() => {
  //         setShowMessage(false);
  //         setIsExiting(false);
  //         context.setMessage("");
  //       }, 1000);
  //     }, 4000);
  //   }
  // }, [context.message]);

  const handleSignIn = async () => {
    //const stringifiedSignOut = JSON.stringify(false);
    const formData = new FormData(form.current);

    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
    };

    if (data.name == "" || data.password == "") {
      
    } else {
      //console.log("REQUEST DATA", data);
      const response = await signInWs(data.email, data.password);
      //console.log("RESPONSE DATA", response);
      //localStorage.setItem('sign-out', data.accessToken);

      if (response.success) {
        // Create account
        const stringifiedAccount = JSON.stringify(data);
        console.log("DATOS1", data);
        console.log("DATOS2", stringifiedAccount);
        //context.setMessageType("");
        //context.setMessage("Ingrese las credenciales");
        localStorage.setItem("account", stringifiedAccount);
        context.setAccount(data);
        context.setSignOut(false);

        navigate("/");
      } else {
        //context.setMessage(response.errorMessage);
      }
      // Redirect
    }
  };

  const createAnAccount = () => {
    // Sign In
    handleSignIn();
  };

  const renderLogIn = () => {
    return (
      <form ref={form} className="flex flex-col gap-4 w-80">
        {/* <p>
          <span className='font-light text-sm'>Email: </span>
          <span>{parsedAccount?.email}</span>
        </p>
        <p>
          <span className='font-light text-sm'>Password: </span>
          <span>{parsedAccount?.password}</span>
        </p> */}
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
            type="text"
            id="password"
            name="password"
            defaultValue={parsedAccount?.password}
            placeholder="******"
            className="rounded-lg border border-black placeholder:font-light placeholder:text-sm placeholder:text-black/60 focus:outline-none py-2 px-4"
          />
        </div>
        <Link to="/">
          <button
            className="bg-black disabled:bg-black/40 text-white  w-full rounded-lg py-3 mt-4 mb-2"
            onClick={() => handleSignIn()}
            //disabled={!hasUserAnAccount}
          >
            Entrar
          </button>
        </Link>
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
          //disabled={hasUserAnAccount}
        >
          Registrarse
        </button>
      </form>
    );
  };

  const renderCreateUserInfo = () => {
    return (
      <form ref={form} className="flex flex-col gap-4 w-80">
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
            Usuario
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
            Your password:
          </label>
          <input
            type="text"
            id="password"
            name="password"
            defaultValue={parsedAccount?.password}
            placeholder="******"
            className="rounded-lg border border-black
            placeholder:font-light placeholder:text-sm placeholder:text-black/60 focus:outline-none py-2 px-4"
          />
        </div>
        <Link to="/">
          <button
            className="bg-black text-white w-full rounded-lg py-3"
            onClick={() => createAnAccount()}
          >
            Create
          </button>
        </Link>
        <Link to="/">
          <button className="border border-black disabled:text-black/40 disabled:border-black/40 rounded-lg mt-6 py-3 w-full">
            Cancelar
          </button>
        </Link>
      </form>
    );
  };

  const renderView = () =>
    view === "create-user-info" ? renderCreateUserInfo() : renderLogIn();

  return (
    <Layout>
      <h1 className="font-medium text-xl text-center mb-6 w-80">Bienvenido</h1>
      {/* {showMessage && (
        <div
          class={`fixed top-0 right-0 m-4 mt-20 p-4 ${
            context.messageType == "Error"
              ? "bg-red-100 border border-red-400 text-red-700"
              : "bg-green-100 border border-green-400 text-green-700"
          } px-4 py-3 relative" role="alert" rounded-lg shadow-lg ${
            isExiting ? "animate-slideOutToRight" : "animate-slideInFromLeft"
          }`}
        >
          <strong class="font-bold">⚠️</strong>
          <span class="block sm:inline"> {context.message}</span>
        </div>
      )} */}
      {renderView()}
    </Layout>
  );
}

export default SignIn;
