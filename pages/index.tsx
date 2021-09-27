import {
  ChangeEvent,
  FormEvent,
  PropsWithChildren,
  useEffect,
  useState,
} from "react";
import Cookies from "js-cookie";

import { $api } from "../api";
import { Country, User } from "../api/types";
import { HttpError } from "../api/repo/http.error";
import { Util } from "../helpers/util";

// import Home from "./Home";

type InputSection = "login" | "signup";

const Error = (props: PropsWithChildren<unknown>) => {
  if (!props.children) {
    return null;
  }

  return <p>error: {props.children}</p>;
};

const deboucedEmailCheck = Util.debounce(
  $api.auth.emailTaken.bind($api.auth),
  1000
);

const Landing = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [inputs, setInputs] = useState({
    login: {
      password: "",
      username: "",
    },
    signup: {
      firstname: "",
      lastname: "",
      email: "",
      password: "",
      country: "",
    },
  });
  const [errors, setErrors] = useState({
    login: "",
    signup: {
      general: "",
      firstname: "",
      lastname: "",
      email: "",
      password: "",
      country: "",
    },
  });
  const [busy, setBusy] = useState({
    login: false,
    signup: true,
  });
  const [countries, setCountries] = useState<Country[]>([]);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const authToken = Cookies.get("auth_token") as string;
    if (authToken && !isLoggedIn) {
      setIsLoggedIn(true);
      $api.$axios.defaults.headers.Authorization = `Bearer ${authToken}`;
      $api.user
        .getProfile()
        .then((user) => {
          setIsLoggedIn(true);
          setUser(user);
        })
        .catch(() => {
          setIsLoggedIn(false);
          setUser(null);
          Cookies.remove("auth_token");
        });
    }

    const authinterceptor = $api.$axios.interceptors.response.use((res) => {
      if (res.status === 401) {
        Cookies.remove("auth_token");
        setIsLoggedIn(false);
        setUser(null);
      }
      return res;
    });

    return () => {
      $api.$axios.interceptors.response.eject(authinterceptor);
    };
  }, [setIsLoggedIn, isLoggedIn]);

  useEffect(() => {
    $api.country
      .getCountries({ all: true })
      .then(({ data: countries }) => {
        setCountries(countries);
      })
      .catch(console.debug)
      .finally(() => {
        setBusy((busy) => ({ ...busy, signup: false }));
      });
  }, [setCountries]);

  const handleInput = (input: InputSection) => {
    return (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = event.target;
      if (input === "signup") {
        setErrors({ ...errors, signup: { ...errors.signup, [name]: "" } });
      }
      if (name === "email" && value) {
        onEmailChange(value);
      }

      setInputs({
        ...inputs,
        [input]: { ...(inputs[input] as object), [name]: value },
      });
    };
  };

  const handleLogout = () => {
    Cookies.remove("auth_token");
    setIsLoggedIn(false);
    setUser(null);
  };

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy({ ...busy, login: true });

    const { username, password } = inputs.login;
    try {
      const loggedinUser = await $api.auth.login(username, password);
      Cookies.set("auth_token", loggedinUser.token);
      setIsLoggedIn(true);
      setUser(loggedinUser.user);
    } catch (error: any) {
      setErrors({ ...errors, login: error.message });
    } finally {
      setBusy({ ...busy, login: false });
    }
  };

  const handleSignup = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy({ ...busy, signup: true });

    try {
      const loggedinUser = await $api.auth.signup(inputs.signup);
      Cookies.set("auth_token", loggedinUser.token);
      setIsLoggedIn(true);
      setUser(loggedinUser.user);
    } catch (error: any) {
      const err = error as HttpError;
      if (err.status === 422) {
        setErrors({ ...errors, signup: { ...errors.signup, ...err.errors } });
        return;
      }

      setErrors({
        ...errors,
        signup: { ...errors.signup, general: err.message },
      });
    } finally {
      setBusy({ ...busy, signup: false });
    }
  };

  // TODO: fix debounce...
  const onEmailChange = async (email: string) => {
    setBusy((busy) => ({ ...busy, signup: true }));
    try {
      const emailTaken = await deboucedEmailCheck(email);
      if (emailTaken) {
        setErrors((errors) => ({
          ...errors,
          signup: { ...errors.signup, email: "email already exists" },
        }));
      } else {
        setErrors((errors) => ({
          ...errors,
          signup: { ...errors.signup, email: "" },
        }));
      }
    } catch (error) {
      console.log("...error checking if email taken");
    } finally {
      setBusy((busy) => ({ ...busy, signup: false }));
    }
  };

  // return <Home />;
  return (
    <>
      <h1>$api export usage examples</h1>
      <hr />
      {!isLoggedIn ? (
        <>
          <h2>Login</h2>
          <hr />
          <form onSubmit={handleLogin} action="#">
            <Error>{errors.login}</Error>
            <input
              onChange={handleInput("login")}
              value={inputs.login.username}
              type="email"
              placeholder="email"
              name="username"
            />
            <br />
            <br />
            <input
              onChange={handleInput("login")}
              value={inputs.login.password}
              type="password"
              placeholder="password"
              name="password"
            />
            <br />
            <br />
            <button disabled={busy.login} type="submit">
              Login
            </button>
          </form>
        </>
      ) : (
        <>
          {user?.firstname}&nbsp;{user?.lastname}&nbsp;({user?.email}
          )&nbsp;&nbsp;<button onClick={handleLogout}>logout</button>
          <hr />
        </>
      )}

      <h2>Signup</h2>
      <hr />
      <form onSubmit={handleSignup} action="#">
        <Error>{errors.signup.general}</Error>
        <input
          type="text"
          placeholder="firstname"
          value={inputs.signup.firstname}
          onChange={handleInput("signup")}
          name="firstname"
        />
        <Error>{errors.signup.firstname}</Error>
        <br />
        <br />
        <input
          type="text"
          placeholder="lastname"
          value={inputs.signup.lastname}
          onChange={handleInput("signup")}
          name="lastname"
        />
        <Error>{errors.signup.lastname}</Error>
        <br />
        <br />
        <input
          type="email"
          placeholder="email"
          value={inputs.signup.email}
          onChange={handleInput("signup")}
          name="email"
        />
        <Error>{errors.signup.email}</Error>
        <br />
        <br />
        <input
          type="password"
          placeholder="password"
          value={inputs.signup.password}
          onChange={handleInput("signup")}
          name="password"
        />
        <Error>{errors.signup.password}</Error>
        <br />
        <br />
        <select name="country" onChange={handleInput("signup")}>
          <option value="">country</option>
          {countries.map((country) => {
            return (
              <option key={country.id} value={country.id}>
                {country.name}
              </option>
            );
          })}
        </select>
        <Error>{errors.signup.country}</Error>
        <br />
        <br />

        <button disabled={busy.signup || !!errors.signup.email} type="submit">
          sign up
        </button>
      </form>
    </>
  );
};

export default Landing;
