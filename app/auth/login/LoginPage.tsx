"use client";

import { useRouter } from "next/navigation";
import styles from "./login.module.css";
import { useState, useEffect } from "react";
import Logo from "@/app/components/logo";

export default function LoginPage() {

  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({
    email: "",
    password: ""
  });

  useEffect(() => {
    fetch("https://web-pgb0.onrender.com")
      .catch(() => { });
  }, []);


  const validate = () => {

    let newErrors = {
      email: "",
      password: ""
    };

    let isValid = true;

    if (!email.trim()) {
      newErrors.email = "Vui lòng nhập email";
      isValid = false;
    }

    if (!password.trim()) {
      newErrors.password = "Vui lòng nhập mật khẩu";
      isValid = false;
    }

    setErrors(newErrors);

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      // const res = await fetch("https://gundamstoreapi-gpd3fxemg8d3cpdt.eastasia-01.azurewebsites.net/auth/login", {
      const res = await fetch("https://web-pgb0.onrender.com/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      // const data = await res.json();
      const text = await res.text();
      console.log("RAW RESPONSE:", text);

      let data;
      try {
        data = JSON.parse(text);
      } catch {
        data = { message: text };
      }

      if (!res.ok) {
        let newErrors = {
          email: "",
          password: ""
        };

        if (data.message === "Invalid email or password") {
          newErrors.email = "Email hoặc mật khẩu không đúng";
          newErrors.password = "Email hoặc mật khẩu không đúng";
        } else {
          newErrors.email = data.message || "Đăng nhập thất bại";
        }

        setErrors(newErrors);
        return;
      }

      const token = data.data.token;
      const role = data.data.user?.role;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(data.data.user));

      if (!token || !role) {
        alert("Thiếu thông tin đăng nhập");
        return;
      }

      setLoading(true);
      // 🔥 CHUYỂN HƯỚNG THEO ROLE + GỬI TOKEN
      if (role === "admin") {
        // router.push("/social");
        window.location.href = `https://gundam-fe.netlify.app/admin?token=${token}`;
      } else {
        // router.push("/social");
        window.location.href = `https://gundam-fe.netlify.app?token=${token}`;
      }

    } catch (error) {
      console.error(error);
      alert("Lỗi kết nối server");
    }
  };

  return (
    <div className={styles.container}>

      <div className={styles.loginWrapper}>

        {/* LEFT SIDE */}
        <div className={styles.leftPanel}>

          <img
            src="/logo5.png"
            alt="HobbyJapan figure"
            className={styles.heroImage}
          />



          <p className={styles.tagline}>
            <b>GunBuys & GunVerse</b> - Nơi dành cho những người đam mê mô hình, mua bán và chia sẻ.
          </p>
        </div>
        {/* RIGHT SIDE */}
        <form className={styles.form} onSubmit={handleSubmit}>

          <h2>Đăng nhập</h2>

          <div className={styles.line}></div>


          <div className={styles.inputGroup}>
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrors(prev => ({ ...prev, email: "" }));
              }}
            />
            {errors.email && (
              <span className={styles.error}>{errors.email}</span>
            )}
          </div>

          <div className={styles.inputGroup}>
            <label>Mật khẩu</label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setErrors(prev => ({ ...prev, password: "" }));
              }}
            />
            {errors.password && (
              <span className={styles.error}>{errors.password}</span>
            )}
          </div>


          <button type="submit" disabled={loading}>
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>

          <p>
            Chưa có tài khoản?
            <span onClick={() => router.push("/auth/register")}>
              Đăng ký
            </span>
          </p>

        </form>

      </div>

    </div>
  );
}