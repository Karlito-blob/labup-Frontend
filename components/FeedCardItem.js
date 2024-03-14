import React from 'react';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Collapse from '@mui/material/Collapse';
import { format } from 'date-fns';
import { useRouter } from 'next/router';
import { useState } from 'react';

const FeedCardItem = ({ item, index, expanded, handleLike, handleExpandClick, count }) => {
    const router = useRouter();
    const [likeCount, setLikeCount] = useState(item.like.length);
    const handleLikeClick = () => {
        handleLike(item._id, item.type);
        setLikeCount(item.like.length)
    };
    return (
        <div key={index}>
            <Card sx={{ width: 320, maxWidth: 700, m: 2, borderRadius: '20px', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)' }} key={item._id} type={item.type}>
                <CardMedia
                    component="img"
                    height={`${item.height}px`}
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
                    <IconButton onClick={handleLikeClick} aria-label="add to favorites">
                        <FavoriteIcon />
                        <div>{likeCount}</div>
                    </IconButton>
                    <IconButton aria-label="share" onClick={() => router.push(`/createPatterns?id=${item._id}`)}>
                        <AutoFixHighIcon />
                    </IconButton>
                    <IconButton
                        onClick={() => handleExpandClick(index)}
                        aria-expanded={expanded === index}
                        aria-label="show more"
                    >
                        <ExpandMoreIcon />
                    </IconButton>
                </CardActions>

                <Collapse in={expanded === index} timeout="auto" unmountOnExit>
                    <CardContent>
                        <Typography paragraph>Details:</Typography>
                        <Typography>{`This is a more detailed description about ${item.patternName}.`}</Typography>
                    </CardContent>
                </Collapse>
            </Card>
        </div>
    );
};

export default FeedCardItem;