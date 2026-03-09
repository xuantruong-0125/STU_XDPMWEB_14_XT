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
    confirmPassword:"",
    phone:"",
    address:"",
    avatar:null as File | null
  });

  const [errors,setErrors] = useState({
    username:"",
    email:"",
    password:"",
    confirmPassword:""
  });

  const validate = () => {
    let newErrors = {
        username:"",
        email:"",
        password:"",
        confirmPassword:""
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

    if(!form.confirmPassword.trim()){
        newErrors.confirmPassword = "Vui lòng xác nhận mật khẩu";
        isValid = false;
    }

    if(form.password && form.confirmPassword && form.password !== form.confirmPassword){
        newErrors.confirmPassword = "Mật khẩu không khớp";
        isValid = false;
    }

    setErrors(newErrors);

    return isValid;
  };

  const handleChange = (e:React.ChangeEvent<HTMLInputElement>)=>{
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleFile = (e:React.ChangeEvent<HTMLInputElement>)=>{
    if(e.target.files){
      setForm({
        ...form,
        avatar: e.target.files[0]
      });
    }
  };

  const handleSubmit = (e:React.FormEvent)=>{
    e.preventDefault();

    if(!validate()){
        return;
    }

    console.log(form);
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
            Tham gia <b>HobbyJapan</b>  để khám phá thế giới Gundam, Figure và các bộ sưu tập độc đáo.
          </p>

        </div>


        {/* RIGHT PANEL */}
        <form className={styles.form} onSubmit={handleSubmit}>

          <h2>Đăng ký tài khoản</h2>

          <div className={styles.formGrid}>

            <div className={styles.inputGroup}>
                <label>Username *</label>
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
                name="confirmPassword"
                type="password"
                onChange={handleChange}
                />
                {errors.confirmPassword && (
                    <span className={styles.error}>{errors.confirmPassword}</span>
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
            Đã có tài khoản?
            <span onClick={()=>router.push("/auth/login")}>
              Đăng nhập
            </span>
          </p>

        </form>

      </div>

    </div>
  );
}