import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { HOST_URL, previewpaththeme } from './config';
import dayjs from 'dayjs';
import Loading from './Loader/Loading';
import { Divider } from '@mui/material';
import { FcNext, FcPrevious } from "react-icons/fc";

const BlogCard = ({ id, title, description, image, author, publishDate, openModal  }) => {
  const shortDescription = description.length > 100 ? description.slice(0, 95) + '...' : description;

  return (
    <div className="max-w-sm overflow-hidden shadow-lg bg-white hover:shadow-xl transition-all rounded-lg">
    <div className=" group relative overflow-hidden ">
      <img className="w-full h-48 object-fit transition-transform duration-1000 ease-in-out group-hover:scale-110" src={`${previewpaththeme}${image}`} alt={title} />
    </div>
      <div className="p-4">
        <h3 className="text-xl font-semibold text-indigo-700">{title}</h3>
        <p className="text-gray-600 mt-2">{shortDescription}</p>
        <div className="mt-2 text-gray-500 text-sm text-end">
          <p>By <span className="font-semibold text-indigo-600">{author}</span>{" "}<span>{dayjs(publishDate).format("DD-MMM-YYYY")}</span></p>
        </div>
        <button 
          onClick={() => openModal(id)} 
          className="text-indigo-600 hover:text-indigo-800 mt-4 inline-block">See More</button>
      </div>
    </div>
  );
};

export const Blog = () => {
  const [blogData, setBlogData] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [selectedBlogIndex, setSelectedBlogIndex] = useState(null);

  useEffect(() => {
    fetchBlogData();
  }, []);

  const fetchBlogData = async () => {
    let res = await axios.post(`${HOST_URL}Blog/GetBlogEcomm`, { "blogId": -1 });
    let result = res?.data?.data;
    if (res?.data?.isSuccess) {
      setBlogData(result);
    } else {
      setBlogData([]);
    }
  };

  const openModal = (id) => {
    const index = blogData.findIndex((blog) => blog.blogId === id); 
    setSelectedBlog(blogData[index]);
    setSelectedBlogIndex(index); 
  };

  const closeModal = () => {
    setSelectedBlog(null);
    setSelectedBlogIndex(null);
  };

  const goToPrevious = () => {
    if (selectedBlogIndex > 0) {
      setSelectedBlog(blogData[selectedBlogIndex - 1]);
      setSelectedBlogIndex(selectedBlogIndex - 1);
    } else {
      setSelectedBlog(blogData[blogData.length - 1]);
      setSelectedBlogIndex(blogData.length - 1);
    }
  };

  const goToNext = () => {
    if (selectedBlogIndex < blogData.length - 1) {
      setSelectedBlog(blogData[selectedBlogIndex + 1]);
      setSelectedBlogIndex(selectedBlogIndex + 1);
    } else {
      setSelectedBlog(blogData[0]); 
      setSelectedBlogIndex(0);
    }
  };

  return (
    <section id="blog" className="p-8">
      {!selectedBlog ? (
        <div>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-indigo-900">Our Latest Article</h2>
          </div>
          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

            {blogData?.length>0?
              blogData?.map((blog) => (
              <BlogCard 
                key={blog.blogId} 
                id={blog.blogId} 
                title={blog.title} 
                author={blog.author}
                publishDate={blog.publishDate}
                description={blog.description} 
                image={blog.blogImage} 
                openModal={openModal} 
              />
            )) : <Loading />}
          </div>
        </div>
      ) : (
        <div className="overflow-hidden max-w-full mx-auto bg-white p-8 rounded-lg shadow-2xl">
          <div className=" group relative overflow-hidden rounded-xl">
          <img className="w-full h-96 object-fit rounded-xl transition-transform duration-1000 ease-in-out p-1 group-hover:scale-105" src={`${previewpaththeme}${selectedBlog.blogImage}`} alt={selectedBlog.title} />
          </div>
          <div className=" text-gray-500 text-sm text-end">
          <h2 className="text-3xl font-semibold text-indigo-700 mt-4 text-start italic">{selectedBlog.title}</h2>
          <p>By <span className="font-semibold text-indigo-600">{selectedBlog.author}</span>{" "}<span>{dayjs(selectedBlog.publishDate).format("DD-MMM-YYYY")}</span></p>
        </div>
          <Divider color="gray" className='mb-1'/>
          <p className="text-gray-600 mt-2 text-justify">{selectedBlog.description}</p>
          <div className="flex justify-between mt-6">
            <button 
              onClick={goToPrevious} 
              className=" text-white px-4 py-2 rounded-md">
              <FcPrevious size={20}/>
            </button>
            <button 
              onClick={closeModal} 
              className="bg-red-600 text-white px-4 py-2 rounded-md">
              Back
            </button>
            <button 
              onClick={goToNext} 
              className=" text-white px-4 py-2 rounded-md">
              <FcNext size={20}/>
            </button>
          </div>
        </div>
      )}
    </section>
  );
};