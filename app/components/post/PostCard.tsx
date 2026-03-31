"use client";

import styles from "./PostCard.module.css";

interface Post {
    id: number;
    user_id: number;
    caption: string;
    images: string[];
    like_count: number;
    comment_count: number;
    share_count: number;
}

type Props = {
    post: Post;
    onClick: () => void;
};

export default function PostCard({ post, onClick }: Props) {
    return (
        <div className={styles.card} onClick={onClick}>
            {/* ảnh */}
            <img
                src={post.images[0] || "/default_post.png"}
                className={styles.image}
            />

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
        </div>
    );
}