import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import axios from 'axios';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import { useSelector } from 'react-redux';
import { format } from 'date-fns';
import { useRouter } from 'next/router';
import FeedCardItem from '../components/FeedCardItem';

export default function FeedCard() {
    const token = useSelector((state) => state.user.value.token);
    const router = useRouter();
    const [feed, setFeed] = useState([]);
    const [expanded, setExpanded] = useState(null);

    useEffect(() => {
        fetch(`http://localhost:3000/feed/`)
            .then((response) => response.json())
            .then((data) => {
                if (data.result) {
                    const feedWithRandomHeight = data.feed.map((item) => ({
                        ...item,
                        height: Math.floor(Math.random() * (500 - 200 + 1)) + 200,
                    }));
                    setFeed(feedWithRandomHeight);
                }
            });
    }, []);

//    const [count, setCount] = useState()

    const handleLike = (fileId, type) => {
        axios.put(`http://localhost:3000/feed/updateLike/${type}/${fileId}/${token}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            .then((res) => {
                if (res.data.result && res.data.updatedFile) {
                    // Mise à jour du feed après le like/unlike
                    setFeed(prevFeed => prevFeed.map(item => {
                        if (item._id === fileId) {
                            return {
                                ...item,
                                like: res.data.updatedFile.like // Mise à jour des likes dans l'élément spécifique
                            };
                        }
                        console.log(item)
                        return item;
                    }));
                }
            })
            // .then((res) => {
            //     console.log((res.data.updatedFile.like).length)
            //     //setCount((res.data.updatedFile.like).length)
            //     return 
            // })
            .catch((error) => {
                console.error('Error:', error);
            });
    };

    const handleExpandClick = (index) => {
        setExpanded(expanded === index ? null : index);
    };

    const feedCards = feed.map((item, index) => (
        <FeedCardItem
            key={index}
            item={item}
            index={index}
            expanded={expanded}
            handleLike={handleLike}
            handleExpandClick={handleExpandClick}
            // count={count}
        />
    ));

    return (
        <div style={{ width: '100vw', height: '100vh' }}>
            <Header chemin={router.pathname} />

            <ResponsiveMasonry columnsCountBreakPoints={{ 100: 1, 750: 2, 900: 3, 1200: 4, 1500: 5 }} style={{ paddingTop: '100px' }}>
                <h1 style={{ padding: '40px 80px' }}>Feed</h1>
                <Masonry style={{ paddingLeft: '40px' }}>{feedCards}</Masonry>
            </ResponsiveMasonry>
        </div>
    );
}
