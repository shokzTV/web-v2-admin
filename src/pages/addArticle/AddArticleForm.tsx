import React, { ReactElement, useState, useMemo, useEffect } from 'react';
import { Form, Input, Icon, Tag, AutoComplete, Button } from 'antd';
const ReactQuill = typeof window === 'object' ? require('react-quill') : () => false;
import 'react-quill/dist/quill.snow.css';
import { useSelector, useDispatch } from 'react-redux';
import { tagsSelector } from '../../store/selectors/tag';
import { createArticle } from '../../store/Article';
import { loadTags } from '../../store/Tag';
import Router from 'next/router';

const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 4 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 16 },
    },
};

const tailFormItemLayout = {
    wrapperCol: {
      xs: {
        span: 24,
        offset: 4,
      },
      sm: {
        span: 24,
        offset: 4,
      },
    },
};

export default function AddArticleForm(): ReactElement {
    const dispatch = useDispatch();
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [tags, setTags] = useState<string[]>([]);
    const [image, setImage] = useState<File | null>(null);
    const [tagInput, setTagInput] = useState(false);
    const [loading, setLoading] = useState(false);
    const [newTagInput, setNewTagInput] = useState('');
    const availableTags = useSelector(tagsSelector);
    const autoCompleteTags = useMemo(() => [...(new Set(Object.values(availableTags).map((tag) => tag.name))).values()], [availableTags]);

    useEffect(() => {
        dispatch(loadTags());
    }, []);

    const addTag = (e) => {
        if(e.target.value.length) {
            setTags([...(new Set([...tags, e.target.value])).values()]);
            setNewTagInput('');
            setTagInput(false);
        }
    };
    const removeTag = (tag) => setTags([...tags.filter((t) => t !== tag)]);

    const create = async () => {
        setLoading(true);
        await dispatch(createArticle(title, tags, body, image));
        setLoading(false);
        Router.push('/articles');
    };

    return <Form {...formItemLayout}>
        <Form.Item label="Title">
           <Input style={{ width: '100%' }} value={title} onChange={(e) => setTitle(e.target.value)} />
        </Form.Item>
        <Form.Item label="Tags">
            {tags.map((tag) => <Tag key={tag} closable={true} onClose={() => removeTag(tag)}>
              {tag.length > 20 ? `${tag.slice(0, 20)}...` : tag}
            </Tag>)}

            {tagInput && (
            <AutoComplete 
                dataSource={autoCompleteTags}
                style={{ width: 100 }} 
                size="small" 
                onSelect={(value) => setNewTagInput(value as string)} 
                filterOption={(inputValue, option) => (option.props.children as string).indexOf(inputValue) !== -1}>
                <Input
                    type="text"
                    size="small"
                    style={{ width: 100 }}
                    value={newTagInput}
                    onChange={(e) => setNewTagInput(e.target.value)}
                    onBlur={addTag}
                    onPressEnter={addTag}
                />
            </AutoComplete>
            )}
            {!tagInput && (
            <Tag onClick={() => setTagInput(true)} style={{ background: '#fff', borderStyle: 'dashed' }}>
                <Icon type="plus" /> New Tag
            </Tag>
            )}
        </Form.Item>

        <Form.Item label="Body">
            <ReactQuill style={{background: '#FFF'}} modules={{
                toolbar: [
                    [{ 'header': [1, 2, false] }],
                    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                    [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
                    ['link', 'image'],
                ],
            }} formats={[
                'header',
                'bold', 'italic', 'underline', 'strike', 'blockquote',
                'list', 'bullet', 'indent',
                'link', 'image'
              ]} theme={'snow'} value={body} onChange={(value) => setBody(value)} />
        </Form.Item>

        <Form.Item label="Cover">
            <Input
                accept="image/*"
                id="image"
                type="file"
                onChange={({target}) => setImage(target.files[0])}
            />
        </Form.Item>

        <Form.Item {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit" onClick={create} loading={loading}>
                Create
            </Button>
        </Form.Item>
        
        <style jsx global>{`
            .ql-toolbar.ql-snow {
                padding: 0px!important;
            }
            .ql-snow .ql-picker.ql-header .ql-picker-label::before {
                position: absolute;
            }
        `}</style>
    </Form>;
}
