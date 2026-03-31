"use client";

import styles from "./PostDetailModal.module.css";
import { useState } from "react";


interface Comment {
    id: number;
    user: {
        username: string;
        avatar: string;
    };
    content: string;
}

interface Post {
    id: number;
    user_id: number;
    caption: string;
    images: string[];
    like_count: number;
    comment_count: number;
    share_count: number;
    comments: Comment[];
}

type Props = {
    post: Post;
    currentUserId: number;
    currentUserAvatar: string;
    currentUsername: string;
    onClose: () => void;
};

export default function PostDetailModal({
    post,
    currentUserId,
    currentUserAvatar,
    currentUsername,
    onClose,
}: Props) {
    const isOwner = post.user_id === currentUserId;
    const [activeMenu, setActiveMenu] = useState<number | null>(null);
    const [privacyMenu, setPrivacyMenu] = useState<number | null>(null);

    const toggleMenu = (id: number) => {
        setActiveMenu(activeMenu === id ? null : id);
    };

    const togglePrivacyMenu = (id: number) => {
        setPrivacyMenu(privacyMenu === id ? null : id);
    };

    const handleEdit = (postId: number) => {
        console.log("Edit post:", postId);
        // TODO: gọi API chỉnh sửa
    };

    const handleDelete = async (postId: number) => {
        console.log("Delete post:", postId);

        // TODO: API
        // await fetch(`/api/posts/${postId}`, { method: "DELETE" });
    };

    const handlePrivacyChange = async (postId: number, type: string) => {
        console.log("Privacy change:", postId, type);

        // ví dụ API
        /*
        await fetch(`/api/posts/${postId}/privacy`,{
            method:"POST",
            body: JSON.stringify({privacy:type})
        })
        */

        setPrivacyMenu(null);
        setActiveMenu(null);
    };

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div
                className={styles.modal}
                onClick={(e) => e.stopPropagation()}
            >
                {/* LEFT */}
                <div className={styles.left}>
                    <img src={post.images[0]} />
                </div>

                {/* RIGHT */}
                <div className={styles.right}>
                    {/* user */}
                    <div className={styles.userRow}>
                        <div className={styles.userInfo}>
                            <img src={currentUserAvatar || "/default_avatar.png"} className={styles.avatar} />
                            <span>{currentUsername}</span>
                        </div>

                        {/* 👇 chỉ hiện nếu là chủ bài viết */}
                        {isOwner && (
                            <div className={styles.menuWrapper}>
                                <img
                                    src="/icons/menu.png"
                                    className={styles.moreIcon}
                                    onClick={() => toggleMenu(post.id)}
                                />

                                {activeMenu === post.id && (
                                    <div className={styles.menu}>

                                        <div
                                            className={styles.menuItem}
                                            onClick={() => handleEdit(post.id)}
                                        >
                                            <img src="/icons/edit.png" className={styles.menuIcon} />
                                            Chỉnh sửa bài viết
                                        </div>

                                        <div
                                            className={styles.menuItem}
                                            onClick={() => handleDelete(post.id)}
                                        >
                                            <img src="/icons/trash.png" className={styles.menuIcon} />
                                            Xóa bài viết
                                        </div>

                                        <div
                                            className={styles.menuItem}
                                            onClick={() => togglePrivacyMenu(post.id)}
                                        >
                                            <img src="/icons/privacy.png" className={styles.menuIcon} />
                                            Quyền riêng tư
                                        </div>

                                        {privacyMenu === post.id && (
                                            <div className={styles.subMenu}>

                                                <div
                                                    className={styles.menuItem}
                                                    onClick={() => handlePrivacyChange(post.id, "public")}
                                                >
                                                    <img src="/icons/global.png" className={styles.menuIcon} />
                                                    Công khai
                                                </div>

                                                <div
                                                    className={styles.menuItem}
                                                    onClick={() => handlePrivacyChange(post.id, "private")}
                                                >
                                                    <img src="/icons/private.png" className={styles.menuIcon} />
                                                    Chỉ mình tôi
                                                </div>

                                            </div>
                                        )}

                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* caption */}
                    <p className={styles.caption}>{post.caption}</p>

                    {/* stats */}
                    <div className={styles.stats}>
                        <span className={styles.statItem}>
                            <img src="/icons/like.png" className={styles.icon} />
                            {post.like_count}
                        </span>

                        <span className={styles.statItem}>
                            <img src="/icons/cmt.png" className={styles.icon} />
                            {post.comment_count}
                        </span>

                        <span className={styles.statItem}>
                            <img src="/icons/share.png" className={styles.icon} />
                            {post.share_count}
                        </span>
                    </div>


                    {/* comments */}
                    <div className={styles.comments}>
                        {post.comments.map((c) => (
                            <div key={c.id} className={styles.commentItem}>
                                <img src={c.user.avatar} className={styles.avatarSmall} />
                                <div>
                                    <span className={styles.username}>{c.user.username}</span>
                                    <p>{c.content}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}