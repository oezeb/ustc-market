import AddIcon from '@mui/icons-material/Add';
import CancelIcon from '@mui/icons-material/Cancel';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import TextField from '@mui/material/TextField';
import Toolbar from '@mui/material/Toolbar';
import React from "react";
import { apiRoutes } from '../api';



function AddItem() {
    const [images, setImages] = React.useState([]);
    const [tags, setTags] = React.useState([]);

    const tagsLimit = 15
    React.useEffect(() => {
        fetch(apiRoutes.tags + `?limit=${tagsLimit}`)
            .then(res => res.json())
            .then(tags => tags.map(tag => tag.tag))
            .then(tags => setTags(tags))
            .catch(err => console.error(err))
    }, [])

    const dataURLtoBlob = (dataURL) => {
        const bytes = atob(dataURL.split(',')[1])
        const mime = dataURL.split(',')[0].split(':')[1].split(';')[0]
        const max = bytes.length
        const ia = new Uint8Array(max)
        for (let i = 0; i < max; i++) ia[i] = bytes.charCodeAt(i)
        return new Blob([ia], { type: mime })
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        const formData = new FormData(event.currentTarget)

        const tags = formData.get('tags').split(/\W+/).filter(tag => tag !== '')
        console.log(tags)
        formData.delete('tags')

        formData.append('tags', JSON.stringify(tags))
        images.forEach((image, index) => {
            formData.append('images', dataURLtoBlob(image), `image${index}.jpeg`)
        })

        fetch(apiRoutes.profileItems, {
            method: 'POST',
            body: formData
        })
            .then(res => res.json())
            .then(data => console.log(data))
            .catch(err => console.error(err))
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ p: 2 }}>
            <Toolbar />
            <TextField name="price" label='Price (RMB)'
                fullWidth variant='standard' size='small' type='number'
                sx={{ mb: 2 }} />
            <TextField name="description" label='Description'
                fullWidth required size='small' multiline maxRows={5} minRows={5}
                sx={{ mb: 2 }} 
                placeholder={descriptionPlaceholder} />
            <TagsInput tags={tags} />
            <ImagesInput images={images} setImages={setImages} />
            <Button type='submit' variant="contained" fullWidth sx={{ mt: 2 }}>
                Submit
            </Button>
            <Toolbar />
        </Box>
    )
}

const descriptionPlaceholder = `Record the following information:
- Item name
- Item origin
- Item condition
- Item location (campus)`

const TagsInput = (props) => {
    const [text, setText] = React.useState('');
    const [tagsExpanded, setTagsExpanded] = React.useState(false);

    const onChange = (event) => {
        const pattern = /^[\w\s#]*$/g
        const value = event.target.value
        if (pattern.test(value)) setText(value)
    };

    return (<>
        <TextField name="tags"
            fullWidth
            size="small"
            sx={{ mb: 2 }} 
            label='Tags'
            multiline
            maxRows={3}
            minRows={3}
            value={text}
            inputProps={{ maxLength: 100 }}
            onChange={onChange} />
        {props.tags.length > 0 && 
        <ListItem dense disablePadding>
            <Collapse in={tagsExpanded} timeout="auto" collapsedSize='24px'>
                <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                    {props.tags.map((tag, index) => (
                        <Chip key={index} 
                        size="small"
                        sx={{ mr: 1, mb: 1 }}
                        label={'#' + tag}
                        onClick={() => setText(prev => prev + ' #' + tag)} />
                    ))}
                </Box>
            </Collapse>
            <IconButton sx={{ p: 0}} onClick={() => setTagsExpanded(prev => !prev)}>
                {tagsExpanded ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
        </ListItem>}
    </>)
}

const ImagesInput = (props) => {
    const { images, setImages } = props

    const maxImages = 5

    const onUploadImage = (event) => {
        const files = event.target.files
        for (const file of files) {
            const reader = new FileReader()
            reader.onload = (event) => {
                setImages(prev => [...prev, event.target.result])
            }
            reader.readAsDataURL(file)
        }
    }

    const Container = (props) => (<Box 
        sx={{ m: 1, width: 56, height: 56,
        borderRadius: 1,
        border: '1px solid #bdbdbd',
        bgcolor: '#f5f5f5',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative' }} {...props} />
    )
    
    return (<>
        <ListItem divider dense>
            <ListItemText primary='Images' />
        </ListItem>
        <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
            {images.map((image, index) => (
                <Container key={index}>
                    <img src={image} alt={index} width='100%' height='100%' />
                    <Box sx={{ position: 'absolute', top: 0, right: 0 }}>
                        <IconButton size="small" onClick={() => {
                            setImages(prev => prev.filter((_, i) => i !== index))
                        }}>
                            <CancelIcon fontSize="inherit" color="error" />
                        </IconButton>
                    </Box>
                </Container>
            ))}
            {images.length < maxImages && (
                <Container>
                    <InputLabel htmlFor="upload-image">
                        <Input
                            id="upload-image"
                            type="file"
                            inputProps={{ multiple: true, accept: 'image/*' }}
                            onChange={onUploadImage}
                            sx={{ display: 'none' }} />
                        <AddIcon fontSize="large" />
                    </InputLabel>
                </Container>
            )}
        </Box>
    </>);
}

export default AddItem