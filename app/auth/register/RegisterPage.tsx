"use client";

import styles from "./register.module.css";
import { useRouter } from "next/navigation";
import { useState } from "react";


export default function RegisterPage(){

  const router = useRouter();

  const [form,setForm] = useState({
    username:"",
    email:"",
    password:"",
    password_confirmation:"",
    phone:"",
    address:"",
    avatar:null as File | null
  });

  const [errors,setErrors] = useState({
    username:"",
    email:"",
    password:"",
    password_confirmation:""
  });

  const validate = () => {
    let newErrors = {
        username:"",
        email:"",
        password:"",
        password_confirmation:""
    };

    let isValid = true;

    if(!form.username.trim()){
        newErrors.username = "Vui lòng nhập username";
        isValid = false;
    }

    if(!form.email.trim()){
        newErrors.email = "Vui lòng nhập email";
        isValid = false;
    }

    if(!form.password.trim()){
        newErrors.password = "Vui lòng nhập mật khẩu";
        isValid = false;
    }

    if(!form.password_confirmation.trim()){
        newErrors.password_confirmation = "Vui lòng xác nhận mật khẩu";
        isValid = false;
    }

    if(form.password && form.password_confirmation && form.password !== form.password_confirmation){
        newErrors.password_confirmation = "Mật khẩu không khớp";
        isValid = false;
    }

    setErrors(newErrors);

    return isValid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFile = (e:React.ChangeEvent<HTMLInputElement>)=>{
    if(e.target.files){
      setForm({
        ...form,
        avatar: e.target.files[0]
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      const formData = new FormData();

      formData.append("username", form.username);
      formData.append("email", form.email);
      formData.append("password", form.password);
      formData.append("password_confirmation", form.password_confirmation); // 🔥 Laravel cần field này
      formData.append("phone", form.phone);
      formData.append("address", form.address);

      if (form.avatar) {
        formData.append("avatar", form.avatar);
      }

      const res = await fetch("https://web-pgb0.onrender.com/register", {
        method: "POST",
        body: formData, // ❗ KHÔNG set Content-Type
      });

      const data = await res.json();
      console.log("RAW:", data);

      if (!res.ok) {
        alert(data.message || "Đăng ký thất bại");
        return;
      }

      console.log("Register success:", data);

      alert("Đăng ký thành công!");

      // 👉 chuyển sang login
      router.push("/auth/login");

    } catch (error) {
      console.error(error);
      alert("Lỗi kết nối server");
    }
  };

   return(
    <div className={styles.container}>

      <div className={styles.wrapper}>

        {/* LEFT PANEL */}
        <div className={styles.leftPanel}>

        <img
            src="/logo.png"
            alt="HobbyJapan figure"
            className={styles.heroImage}
          />


          <p className={styles.tagline}>
            Tham gia <b>HobbyJapan</b> để khám phá thế giới Gundam, Figure và các bộ sưu tập độc đáo.
          </p>

        </div>


        {/* RIGHT PANEL */}
        <form className={styles.form} onSubmit={handleSubmit}>

          <h2>Đăng ký tài khoản</h2>

          <div className={styles.formGrid}>

            <div className={styles.inputGroup}>
                <label>Tên người dùng *</label>
                <input
                name="username"
                type="text"
                onChange={handleChange}
                />
                {errors.username && <span className={styles.error}>{errors.username}</span>}
            </div>

            <div className={styles.inputGroup}>
                <label>Email *</label>
                <input
                name="email"
                type="email"
                onChange={handleChange}
                />
                {errors.email && <span className={styles.error}>{errors.email}</span>}
            </div>

            <div className={styles.inputGroup}>
                <label>Mật khẩu *</label>
                <input
                name="password"
                type="password"
                onChange={handleChange}
                />
                {errors.password && <span className={styles.error}>{errors.password}</span>}
            </div>

            <div className={styles.inputGroup}>
                <label>Xác nhận mật khẩu *</label>
                <input
                name="password_confirmation"
                type="password"
                onChange={handleChange}
                />
                {errors.password_confirmation && (
                    <span className={styles.error}>{errors.password_confirmation}</span>
                )}
            </div>

            <div className={styles.inputGroup}>
                <label>Số điện thoại</label>
                <input
                name="phone"
                type="number"
                onChange={handleChange}
                />
            </div>

            <div className={styles.inputGroup}>
                <label>Địa chỉ</label>
                <input
                name="address"
                type="text"
                onChange={handleChange}
                />
            </div>

            <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                <label>Ảnh đại diện</label>
                <input
                type="file"
                accept="image/*"
                onChange={handleFile}
                />
            </div>

          </div>

          <button type="submit">Đăng ký</button>

          <p>
            Đã có tài khoản? &nbsp;
            <span onClick={()=>router.push("/auth/login")}>
              Đăng nhập
            </span>
          </p>

        </form>

      </div>

    </div>
  );
}