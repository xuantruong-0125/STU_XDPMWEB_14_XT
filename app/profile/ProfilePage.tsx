"use client";

import styles from "./profile.module.css";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

interface FollowUser {
    id: number;
    name: string;
    avatar: string;
}

interface Post {
    id: number;
    content: string;
}

interface User {
    id: number;
    name: string;
    email: string;
    avatar: string;
    bio?: string;
    followers: FollowUser[];
    following: FollowUser[];
    posts: Post[];

}
export default function ProfilePage() {
    const [user, setUser] = useState<User | null>(null);
    const [openModal, setOpenModal] = useState<"followers" | "following" | null>(null);
    const [openPostModal, setOpenPostModal] = useState(false);
    const [content, setContent] = useState("");
    const [images, setImages] = useState<File[]>([]);

    const [openSelect, setOpenSelect] = useState(false);
    const [privacy, setPrivacy] = useState<"public" | "private">("public");
    useEffect(() => {
        // giả lập fetch API
        const fetchUser = async () => {
            // sau này thay bằng API thật
            const data: User = {
                id: 1,
                name: "Nguyễn Văn A",
                email: "vana@gmail.com",
                avatar: "https://i.pravatar.cc/150?img=3",
                bio: "Lập trình viên yêu thích công nghệ 🚀",

                followers: [
                    { id: 2, name: "An", avatar: "https://i.pravatar.cc/100?img=5" },
                    { id: 3, name: "Bình", avatar: "https://i.pravatar.cc/100?img=6" },
                ],

                following: [
                    { id: 4, name: "Cường", avatar: "https://i.pravatar.cc/100?img=7" },
                    { id: 5, name: "Dũng", avatar: "https://i.pravatar.cc/100?img=8" },
                ],
                posts: [],


            };

            setUser(data);
        };

        fetchUser();
    }, []);

    if (!user) return <div>Đang tải...</div>;

    return (

        <>
            <Navbar
                user={{
                    name: user.name,
                    avatar: user.avatar,
                }}
            />

            <div className={styles.container}>
                {/* PHẦN TRÊN */}
                <div className={styles.topSection}>

                    {/* Avatar */}
                    <div className={styles.avatarSection}>
                        <img src={user.avatar} alt="avatar" className={styles.avatar} />
                    </div>

                    {/* Thông tin */}
                    <div className={styles.infoSection}>

                        {/* Hàng 1: Tên */}
                        <h2 className={styles.name}>{user.name}</h2>

                        {/* Hàng 2: Buttons */}
                        <div className={styles.actionRow}>
                            <button
                                className={styles.postBtn}
                                onClick={() => setOpenPostModal(true)}
                            >
                                <img src="/icons/plus.png" className={styles.icon} />
                                Đăng bài
                            </button>

                            <button className={styles.editBtn}>
                                <img src="/icons/edit1.png" className={styles.icon} />
                                Chỉnh sửa hồ sơ
                            </button>
                        </div>

                        {/* Hàng 3: Follow */}
                        <div className={styles.followRow}>
                            <span onClick={() => setOpenModal("followers")} className={styles.clickable}>
                                <strong>{user.followers.length}</strong> Followers
                            </span>

                            <span onClick={() => setOpenModal("following")} className={styles.clickable}>
                                <strong>{user.following.length}</strong> Following
                            </span>
                        </div>

                        {/* Hàng 4: Bio */}
                        <p className={styles.bio}>
                            {user.bio ? user.bio : "Chưa có tiểu sử"}
                        </p>

                    </div>
                </div>

                {/* PHẦN DƯỚI: POSTS */}
                <div className={styles.postSection}>
                    <h3>Bài viết</h3>

                    {user.posts && user.posts.length > 0 ? (
                        user.posts.map((post) => (
                            <div key={post.id} className={styles.postCard}>
                                {post.content}
                            </div>
                        ))
                    ) : (
                        <p className={styles.noPost}>Chưa có bài viết</p>
                    )}
                </div>
            </div>

            {openModal && (
                <div className={styles.modalOverlay} onClick={() => setOpenModal(null)}>
                    <div
                        className={styles.modal}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3>
                            {openModal === "followers" ? "Followers" : "Following"}
                        </h3>

                        <div className={styles.userList}>
                            {(openModal === "followers" ? user.followers : user.following).length > 0 ? (
                                (openModal === "followers" ? user.followers : user.following).map((u) => (
                                    <div key={u.id} className={styles.userItem}>
                                        <img src={u.avatar} className={styles.smallAvatar} />
                                        <span>{u.name}</span>
                                    </div>
                                ))
                            ) : (
                                <p>Không có dữ liệu</p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {openPostModal && (
                <div
                    className={styles.modalOverlay2}
                    onClick={() => setOpenPostModal(false)}
                >
                    <div
                        className={styles.postModal}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Title */}
                        <h3 className={styles.modalTitle}>Tạo bài viết</h3>

                        {/* User + Privacy */}
                        <div className={styles.postHeader}>
                            <img src={user.avatar} className={styles.smallAvatar} />

                            {/* <select
                                value={privacy}
                                onChange={(e) => setPrivacy(e.target.value)}
                                className={styles.select}
                            >
                                <option value="public">

                                    Công khai
                                </option>
                                <option value="private">

                                    Riêng tư
                                </option>
                            </select> */}

                            <div className={styles.selectWrapper}>
                                {/* Selected */}
                                <div
                                    className={styles.selectBox}
                                    onClick={() => setOpenSelect(!openSelect)}
                                >
                                    <img
                                        src={
                                            privacy === "public"
                                                ? "/icons/global.png"
                                                : "/icons/private.png"
                                        }
                                        className={styles.icon}
                                    />
                                    <span>
                                        {privacy === "public" ? "Công khai" : "Riêng tư"}
                                    </span>
                                </div>

                                {/* Dropdown */}
                                {openSelect && (
                                    <div className={styles.dropdown}>
                                        <div
                                            className={styles.option}
                                            onClick={() => {
                                                setPrivacy("public");
                                                setOpenSelect(false);
                                            }}
                                        >
                                            <img src="/icons/global.png" className={styles.icon} />
                                            Công khai
                                        </div>

                                        <div
                                            className={styles.option}
                                            onClick={() => {
                                                setPrivacy("private");
                                                setOpenSelect(false);
                                            }}
                                        >
                                            <img src="/icons/private.png" className={styles.icon} />
                                            Riêng tư
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Content */}
                        <textarea
                            className={styles.textarea}
                            placeholder="Bạn đang nghĩ gì?"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />

                        {/* Upload ảnh */}
                        {/* <input
                            className={styles.postimg}
                            type="file"
                            multiple
                            onChange={(e) =>
                                setImages(Array.from(e.target.files || []))
                            }
                        /> */}

                        <label className={styles.uploadBtn}>
                            <img src="/icons/image.png" className={styles.icon} />
                            Chọn ảnh
                            <input
                                type="file"
                                multiple
                                className={styles.hiddenInput}
                                onChange={(e) =>
                                    setImages(Array.from(e.target.files || []))
                                }
                            />
                        </label>

                        {/* Preview ảnh */}
                        <div className={styles.preview}>
                            {images.map((img, index) => (
                                <img
                                    key={index}
                                    src={URL.createObjectURL(img)}
                                    className={styles.previewImg}
                                />
                            ))}
                        </div>

                        {/* Button */}
                        <button className={styles.submitBtn}>
                            Đăng
                        </button>
                    </div>
                </div>
            )}

        </>
    );
}