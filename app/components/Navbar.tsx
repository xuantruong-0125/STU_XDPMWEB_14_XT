"use client";

import styles from "./navbar.module.css";

type User = {
  name: string;
  avatar: string;
};

export default function Navbar({ user }: { user: User }) {
  return (
    <nav className={styles.navbar}>

      <div className={styles.logo}>
        <img src="/logo3.png" alt="HobbyJapan Logo" />
        <p>GunVerse</p>
      </div>

      <div className={styles.menu}>

        <a href="/social" className={styles.menuItem}>
          <img src="/icons/home.png" className={styles.menuIcon}/>
          <span className={styles.menuText}>Trang chủ</span>
        </a>

        <a href="#" className={styles.menuItem}>
          <img src="/icons/shop.png" className={styles.menuIcon}/>
          <span className={styles.menuText}>Mua hàng</span>
        </a>

        <a href="/profile" className={styles.menuItem}>
          <img src="/icons/profile.png" className={styles.menuIcon}/>
          <span className={styles.menuText}>Trang cá nhân</span>
        </a>

      </div>

      <div className={styles.user}>
        <img src={user.avatar} className={styles.avatar}/>
        <span className={styles.username}>{user.name}</span>
      </div>

    </nav>
  );
}