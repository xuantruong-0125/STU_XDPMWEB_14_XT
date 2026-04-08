"use client";

import styles from "./profile.module.css";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { getMe } from "../utils/auth";
import { getFollowers, getFollowing, updateUser, createPost, getUserPosts } from "../utils/api";
import { useUser } from "../context/UserContext";
import PostCard from "../components/post/PostCard";
import PostDetailModal from "../components/post/PostDetailModal";


interface FollowUser {
    id: number;
    name: string;
    avatar: string;
}

interface Post {
    id: number;
    caption: string;
    images: string[];
    like_count: number;
    comment_count: number;
    share_count: number;
    comments: {
        id: number;
        user: {
            username: string;
            avatar: string;
        };
        content: string;
    }[];
    user_id: number
    status: "active" | "hidden";
}

interface User {
    id: number;
    username: string;
    email: string;
    avatar: string;
    phone: string;
    address: string;
    followers: FollowUser[];
    following: FollowUser[];
    posts: Post[];

}
export default function ProfilePage() {
    // const [user, setUser] = useState<User | null>(null);
    const { user, setUser } = useUser();
    const [openModal, setOpenModal] = useState<"followers" | "following" | null>(null);
    const [openPostModal, setOpenPostModal] = useState(false);
    const [content, setContent] = useState("");
    const [images, setImages] = useState<File[]>([]);

    const [openSelect, setOpenSelect] = useState(false);
    const [privacy, setPrivacy] = useState<"public" | "private">("public");

    const [openEditModal, setOpenEditModal] = useState(false);

    const [followers, setFollowers] = useState<FollowUser[]>([]);
    const [following, setFollowing] = useState<FollowUser[]>([]);
    const [loadingFollow, setLoadingFollow] = useState(false);

    const [selectedPost, setSelectedPost] = useState<Post | null>(null);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);

    const [posts, setPosts] = useState<Post[]>([]);
    const [loadingPosts, setLoadingPosts] = useState(true);

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.username || "",
                email: user.email || "",
                phone: user.phone || "",
                address: user.address || "",
                avatar: user.avatar || "/default_avatar.png",
            });
        }
    }, [user]);

    useEffect(() => {
        const handleClickOutside = () => setOpenSelect(false);
        if (openSelect) {
            document.addEventListener("click", handleClickOutside);
        }
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, [openSelect]);


    useEffect(() => {
        const fetchPosts = async () => {
            if (!user?.id) return;

            try {
                setLoadingPosts(true);

                const res = await getUserPosts(user.id);

                console.log("POSTS:", res);

                setPosts(res.data || res); // tùy backend trả

            } catch (err) {
                console.error("Fetch posts error:", err);
            } finally {
                setLoadingPosts(false);
            }
        };

        fetchPosts();
    }, [user?.id]);

    const [formData, setFormData] = useState({
        name: user?.username || "",
        email: user?.email || "",
        phone: "",
        address: "",
        avatar: user?.avatar ?? "/default_avatar.png",
    });

    useEffect(() => {
        const fetchUser = async () => {
            const data = await getMe();
            console.log("ME DATA:", data);

            setUser(data?.data?.user || data?.data);
        };

        fetchUser();
    }, []);


    const handleCreatePost = async () => {
        try {
            const formData = new FormData();

            formData.append("caption", content);

            // 🔥 mapping đúng backend
            formData.append(
                "status",
                privacy === "public" ? "active" : "hidden"
            );

            images.forEach((img) => {
                formData.append("images[]", img);
            });

            const res = await createPost(formData);
            // 🔥 thêm bài viết mới vào UI ngay
            const newPost = res.data || res;
            setPosts(prev => [newPost, ...prev]);


            console.log("CREATE POST:", res);

            // reset
            setContent("");
            setImages([]);
            setOpenPostModal(false);

            // reload user/posts
            const data = await getMe();
            setUser(data?.data?.user || data?.data);

        } catch (err) {
            console.error("Create post error:", err);
        }
    };

    const handleDeletePost = (postId: number) => {
        setPosts(prev => prev.filter(p => p.id !== postId));

        setSelectedPost(prev =>
            prev?.id === postId ? null : prev
        );
    };

    const handleUpdatePost = (updatedPost: Post) => {
        setPosts(prev =>
            prev.map(p =>
                p.id === updatedPost.id
                    ? { ...p, ...updatedPost } // 🔥 merge
                    : p
            )
        );

        setSelectedPost(prev =>
            prev ? { ...prev, ...updatedPost } : prev
        );
    };

    if (!user) return <div>Đang tải...</div>;

    return (

        <>
            <Navbar />

            <div className={styles.container}>
                {/* PHẦN TRÊN */}
                <div className={styles.topSection}>

                    {/* Avatar */}
                    <div className={styles.avatarSection}>
                        <img src={user.avatar || "/default_avatar.png"} alt="avatar" className={styles.avatar} />
                    </div>

                    {/* Thông tin */}
                    <div className={styles.infoSection}>

                        {/* Hàng 1: Tên */}
                        <h2 className={styles.name}>{user.username}</h2>

                        {/* Hàng 2: Buttons */}
                        <div className={styles.actionRow}>
                            <button
                                className={styles.postBtn}
                                onClick={() => setOpenPostModal(true)}
                            >
                                <img src="/icons/plus.png" className={styles.icon} />
                                Đăng bài
                            </button>

                            <button
                                className={styles.editBtn}
                                onClick={() => setOpenEditModal(true)}
                            >
                                <img src="/icons/edit1.png" className={styles.icon} />
                                Chỉnh sửa hồ sơ
                            </button>
                        </div>

                        {/* Hàng 3: Follow */}
                        <div className={styles.followRow}>
                            {/* <span onClick={() => setOpenModal("followers")} className={styles.clickable}>
                                <strong>{user?.followers?.length || 0}</strong> Followers
                            </span>

                            <span onClick={() => setOpenModal("following")} className={styles.clickable}>
                                <strong>{user?.following?.length || 0}</strong> Following
                            </span> */}

                            <span
                                onClick={async () => {
                                    setOpenModal("followers");
                                    setLoadingFollow(true);

                                    const res = await getFollowers(user.id);
                                    setFollowers(res.data || res); // tùy backend trả

                                    setLoadingFollow(false);
                                }}
                                className={styles.clickable}
                            >
                                <strong>{followers.length}</strong> Followers
                            </span>

                            <span
                                onClick={async () => {
                                    setOpenModal("following");
                                    setLoadingFollow(true);

                                    const res = await getFollowing(user.id);
                                    setFollowing(res.data || res);

                                    setLoadingFollow(false);
                                }}
                                className={styles.clickable}
                            >
                                <strong>{following.length}</strong> Following
                            </span>
                        </div>



                    </div>
                </div>

                {/* PHẦN DƯỚI: POSTS */}
                <div className={styles.postSection}>
                    <h3>Bài viết</h3>

                    {/* {user.posts && user.posts.length > 0 ? (
                        user.posts.map((post) => (
                            <div key={post.id} className={styles.postCard}>
                                {post.content}
                            </div>
                        ))
                    ) : (
                        <p className={styles.noPost}>Chưa có bài viết</p>
                    )} */}
                    <div className={styles.postGrid}>
                        {/* {mockPosts.length > 0 ? ( */}
                        {loadingPosts ? (
                            <p>Đang tải bài viết...</p>
                        ) : posts.length > 0 ? (

                            // mockPosts.map((post) => (
                            posts.map((post) => (


                                <PostCard
                                    key={post.id}
                                    post={post}
                                    onClick={() => setSelectedPost(post)}
                                />
                            ))
                        ) : (
                            <p className={styles.noPost}>Chưa có bài viết</p>
                        )}
                    </div>
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
                            {loadingFollow ? (
                                <p>Đang tải...</p>
                            ) : (openModal === "followers" ? followers : following).length > 0 ? (
                                (openModal === "followers" ? followers : following).map((u) => (
                                    <div key={u.id} className={styles.userItem}>
                                        <img
                                            src={u.avatar || "/default_avatar.png"}
                                            className={styles.smallAvatar}
                                        />
                                        <span>{u.name}</span>
                                    </div>
                                ))
                            ) : (
                                <p>Chưa có</p>
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
                            <img src={user.avatar || "/default_avatar.png"} className={styles.smallAvatar} />

                            <div className={styles.privacyWrapper}>
                                <label className={styles.radioOption}>
                                    <input
                                        type="radio"
                                        name="privacy"
                                        value="public"
                                        checked={privacy === "public"}
                                        onChange={() => setPrivacy("public")}
                                    />

                                    <div className={styles.radioContent}>
                                        <img src="/icons/global.png" className={styles.icon} />
                                        <span>Công khai</span>
                                    </div>
                                </label>

                                <label className={styles.radioOption}>
                                    <input
                                        type="radio"
                                        name="privacy"
                                        value="private"
                                        checked={privacy === "private"}
                                        onChange={() => setPrivacy("private")}
                                    />

                                    <div className={styles.radioContent}>
                                        <img src="/icons/private.png" className={styles.icon} />
                                        <span>Riêng tư</span>
                                    </div>
                                </label>
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

                        <div className={styles.line}></div>


                        {/* Button */}
                        <button className={styles.submitBtn} onClick={handleCreatePost}>
                            Đăng
                        </button>
                    </div>
                </div>
            )}

            {openEditModal && (
                <div
                    className={styles.modalOverlay}
                    onClick={() => setOpenEditModal(false)}
                >
                    <div
                        className={styles.editModal}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 className={styles.modalTitle}>Chỉnh sửa hồ sơ</h3>

                        {/* Avatar */}
                        <div className={styles.avatarEdit}>
                            <img
                                src={formData.avatar || "/default_avatar.png"}
                                className={styles.avatarLarge}
                            />

                            <label className={styles.uploadBtn}>
                                Đổi ảnh

                                <input
                                    type="file"
                                    className={styles.hiddenInput}
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            setAvatarFile(file); // giữ file thật
                                            setFormData({
                                                ...formData,
                                                avatar: URL.createObjectURL(file), // chỉ để preview
                                            });
                                        }
                                    }}
                                // onChange={(e) => {
                                //     const file = e.target.files?.[0];
                                //     if (file) {
                                //         setFormData({
                                //             ...formData,
                                //             avatar: URL.createObjectURL(file),
                                //         });
                                //     }
                                // }}
                                />
                            </label>
                        </div>

                        {/* Input fields */}
                        {/* Row 1: username + email */}
                        <div className={styles.row}>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Tên người dùng</label>
                                <input
                                    className={styles.input}
                                    value={formData.name}
                                    onChange={(e) =>
                                        setFormData({ ...formData, name: e.target.value })
                                    }
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>Email</label>
                                <input
                                    className={styles.input}
                                    value={formData.email} disabled
                                    onChange={(e) =>
                                        setFormData({ ...formData, email: e.target.value })
                                    }
                                />
                            </div>
                        </div>

                        {/* Row 2: phone + address */}
                        <div className={styles.row}>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Số điện thoại</label>
                                <input
                                    className={styles.input}
                                    value={formData.phone}
                                    onChange={(e) =>
                                        setFormData({ ...formData, phone: e.target.value })
                                    }
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>Địa chỉ</label>
                                <input
                                    className={styles.input}
                                    value={formData.address}
                                    onChange={(e) =>
                                        setFormData({ ...formData, address: e.target.value })
                                    }
                                />
                            </div>
                        </div>

                        <div className={styles.line}></div>

                        {/* Button */}
                        <button
                            className={styles.submitBtn}
                            onClick={async () => {
                                try {
                                    const form = new FormData();

                                    form.append("username", formData.name);
                                    form.append("email", formData.email);
                                    form.append("phone", formData.phone || "");
                                    form.append("address", formData.address || "");

                                    // thêm avatar nếu có chọn
                                    if (avatarFile) {
                                        form.append("avatar", avatarFile);
                                    }

                                    // nếu Laravel dùng PATCH
                                    form.append("_method", "PATCH");

                                    const res = await updateUser(user!.id, form);

                                    const updatedUser = res.data || res;

                                    setUser({
                                        ...user!,
                                        username: updatedUser.username,
                                        email: updatedUser.email,
                                        avatar: updatedUser.avatar,
                                        phone: updatedUser.phone,
                                        address: updatedUser.address,
                                    });

                                    setOpenEditModal(false);
                                } catch (err) {
                                    console.error("Update failed:", err);
                                }
                            }}

                        // onClick={async () => {
                        //     try {
                        //         const form = new FormData();

                        //         form.append("username", formData.name);
                        //         form.append("email", formData.email);
                        //         form.append("phone", formData.phone || "");
                        //         form.append("address", formData.address || "");

                        //         // nếu avatar là file (user vừa chọn)
                        //         if (formData.avatar && formData.avatar.startsWith("blob:")) {
                        //             const res = await fetch(formData.avatar);
                        //             const blob = await res.blob();
                        //             form.append("avatar", blob, "avatar.png");
                        //         }

                        //         const res = await updateUser(user!.id, form);

                        //         // cập nhật lại UI
                        //         const updatedUser = res.data || res;

                        //         setUser({
                        //             ...user!,
                        //             username: updatedUser.username,
                        //             email: updatedUser.email,
                        //             avatar: updatedUser.avatar,
                        //             phone: updatedUser.phone,
                        //             address: updatedUser.address,
                        //         });

                        //         setOpenEditModal(false);
                        //     } catch (err) {
                        //         console.error("Update failed:", err);
                        //     }
                        // }}

                        // onClick={async () => {
                        //     try {
                        //         const res = await updateUser(user!.id, {
                        //             username: formData.name,
                        //             email: formData.email,
                        //             phone: formData.phone || "",
                        //             address: formData.address || "",
                        //             // ❌ KHÔNG gửi avatar blob
                        //         });

                        //         console.log("API RESPONSE:", res);

                        //         const updatedUser = res.data || res;

                        //         setUser({
                        //             ...user!,
                        //             username: updatedUser.username,
                        //             email: updatedUser.email,
                        //             avatar: updatedUser.avatar,
                        //             phone: updatedUser.phone,
                        //             address: updatedUser.address,
                        //         });

                        //         setOpenEditModal(false);
                        //     } catch (err) {
                        //         console.error("Update failed:", err);
                        //     }
                        // }}
                        >
                            Lưu thay đổi
                        </button>
                    </div>
                </div>
            )}

            {selectedPost && (
                <PostDetailModal
                    post={selectedPost}
                    currentUserId={user.id}
                    currentUserAvatar={user.avatar}
                    currentUsername={user.username}
                    onClose={() => setSelectedPost(null)}
                    onUpdatePost={handleUpdatePost}
                    onDeletePost={handleDeletePost}
                />
            )}

        </>
    );
}