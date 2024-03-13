import * as React from 'react';
import Header from '../components/Header';

import Masonry, { ResponsiveMasonry } from "react-responsive-masonry"

import { useState, useEffect } from 'react';
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
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { format } from 'date-fns'; // Pour formater les dates

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

    const handleExpandClick = (index) => {
        // Expand ou collapse la carte cliquée en fonction de son état actuel
        setExpanded(expanded === index ? null : index);
    };

    const feedCards = feed.map((item, index) => (
        <div key={index} style={{ marginTop: '100px' }}>
            <Card sx={{ width: 320, maxWidth: 700, m: 2, borderRadius: '20px' }} key={item._id}>

                <CardMedia
                    component="img"
                    height={`${item.height}px`} // Utilisez la hauteur aléatoire ici
                    image={item.images}
                    alt={item.filename}
                />

                <CardHeader
                    avatar={
                        <Avatar sx={{ bgcolor: red[200] }} aria-label="recipe">
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
                    <IconButton aria-label="add to favorites">
                        <FavoriteIcon />
                    </IconButton>
                    <IconButton aria-label="share">
                        <ShareIcon />
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
        <div style={{ backgroundColor: 'black', width: '100vw', height: '100vh' }}>
            <Header style={{ position: 'fixed', width: '100vw', top: 0, zIndex: 1000 }} />

            <ResponsiveMasonry
                columnsCountBreakPoints={{ 100: 1, 750: 2, 900: 3, 1200: 4, 1500: 5 }}
             
            >

                <Masonry>
                    {feedCards}
                </Masonry>
            </ResponsiveMasonry>

        </div>
    );
}
