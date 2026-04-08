export const getFollowers = async (userId: number) => {
    const res = await fetch(`https://web-pgb0.onrender.com/users/${userId}/followers`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    });

    return res.json();
};

export const getFollowing = async (userId: number) => {
    const res = await fetch(`https://web-pgb0.onrender.com/users/${userId}/following`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    });

    return res.json();
};

export const updateUser = async (userId: number, data: any) => {
    const res = await fetch(`https://web-pgb0.onrender.com/users/${userId}`, {
        method: "POST", // hoặc PUT
        headers: {
            // "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: data, // dùng FormData
        // body: JSON.stringify(data), // ✅ gửi JSON

    });
        console.log("STATUS:", res.status);

    const json = await res.json();
    console.log("RAW RESPONSE:", json);
    console.log("ERROR RESPONSE:", json);
    // return res.json();
    return json;
};

export const getUserById = async (id: string | number) => {
    try {
        const token = localStorage.getItem("token");
        // const id = 3;

        const res = await fetch(`https://web-pgb0.onrender.com//api/users/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        if (!res.ok) {
            throw new Error("Failed to fetch user");
        }

        const data = await res.json();
        return data;
    } catch (error) {
        console.error("getUserById error:", error);
        return null;
    }
};

export const createPost = async (data: FormData) => {
    const token = localStorage.getItem("token");

    const res = await fetch("https://web-pgb0.onrender.com/posts", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: data, // dùng FormData để upload ảnh
    });

    return res.json();
};

export const getUserPosts = async (userId: number) => {
    const token = localStorage.getItem("token");

    const res = await fetch(`https://web-pgb0.onrender.com/users/${userId}/posts`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return res.json();
};