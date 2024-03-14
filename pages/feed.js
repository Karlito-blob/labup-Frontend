import * as React from 'react';
import Header from '../components/Header';
import axios from 'axios';

import Masonry, { ResponsiveMasonry } from "react-responsive-masonry"

import { useState, useEffect, useRef } from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { format } from 'date-fns'; // Pour formater les dates
import { useSelector } from 'react-redux';

import { useRouter } from 'next/router';

const ExpandMore = styled((props) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
})(({ theme, expand }) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
    }),
}));

export default function FeedCard() {

    const token = useSelector((state) => state.user.value.token)


    const router = useRouter();

    const [feed, setFeed] = useState([]);
    const [expanded, setExpanded] = useState(null);

    useEffect(() => {
        fetch(`http://localhost:3000/feed/`)
            .then(response => response.json())
            .then(data => {
                if (data.result) {
                    // Ajoutons une hauteur aléatoire pour chaque élément du feed pour la simulation
                    const feedWithRandomHeight = data.feed.map(item => ({
                        ...item,
                        height: Math.floor(Math.random() * (500 - 200 + 1)) + 200
                    }));
                    setFeed(feedWithRandomHeight);
                }
            });
    }, []);

    const updateLikeCount = (fileId, newLikeCount) => {
        setFeed(prevFeed => prevFeed.map(item => {
            if (item._id === fileId) {
                return {
                    ...item,
                    like: newLikeCount
                };
            }
            return item;
        }));
    };

    const handleLike = (fileId, type) => {
        console.log(fileId, type)
        axios.put(`http://localhost:3000/feed/updateLike/${type}/${fileId}/${token}`,
        {
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(res => {
            console.log(res)
        })
        .catch(error => {
            console.error("Error:", error);
        })
    }

    const handleExpandClick = (index) => {
        // Expand ou collapse la carte cliquée en fonction de son état actuel
        setExpanded(expanded === index ? null : index);
    };

    const feedCards = feed.map((item, index) => (
        <div key={index} >
            <Card sx={{ width: 320, maxWidth: 700, m: 2, borderRadius: '20px', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)' }} key={item._id} type={item.type}>

                <CardMedia
                    component="img"
                    height={`${item.height}px`} // Utilisez la hauteur aléatoire ici
                    image={item.images}
                    alt={item.filename}
                />

                <CardHeader
                    avatar={
                        <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                            {item.user.userName[0]}
                        </Avatar>
                    }
                    action={
                        <IconButton aria-label="settings">
                            <MoreVertIcon />
                        </IconButton>
                    }
                    title={item.patternName}
                    subheader={format(new Date(item.creationDate), 'PPP')}
                />

                <CardContent>
                    <Typography variant="body2" color="text.secondary">
                        Created by: {item.user.userName}
                    </Typography>
                </CardContent>

                <CardActions disableSpacing>
                    <IconButton  onClick={() => handleLike(item._id, item.type)} aria-label="add to favorites">
                        <FavoriteIcon />
                        <div >{item.like.length}</div>
                    </IconButton>
                    <IconButton aria-label="share" onClick={() => router.push(`/createPatterns?id=${item._id}`)}>
                        <AutoFixHighIcon />
                    </IconButton>
                    <ExpandMore
                        expand={expanded === index}
                        onClick={() => handleExpandClick(index)}
                        aria-expanded={expanded === index}
                        aria-label="show more"
                    >
                        <ExpandMoreIcon />
                    </ExpandMore>
                </CardActions>

                <Collapse in={expanded === index} timeout="auto" unmountOnExit>
                    <CardContent>
                        <Typography paragraph>Details:</Typography>
                        <Typography>
                            {`This is a more detailed description about ${item.patternName}.`}
                        </Typography>
                    </CardContent>
                </Collapse>

            </Card>
        </div>
    ));

    return (
        <div style={{ width: '100vw', height: '100vh' }}>

            <Header chemin={router.pathname} />

            <ResponsiveMasonry
                columnsCountBreakPoints={{ 100: 1, 750: 2, 900: 3, 1200: 4, 1500: 5 }}
                style={{ paddingTop: '100px', }}
            >
                <h1 style={{ padding: '40px 80px' }}>Feed</h1>

                <Masonry style={{ paddingLeft: '40px' }}>

                    {feedCards}
                </Masonry>
            </ResponsiveMasonry>

        </div>
    );
}
