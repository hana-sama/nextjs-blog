import { GetStaticPaths, GetStaticProps } from "next";
import * as path from "path";
import * as fs from "fs";
import matter from "gray-matter";
import { serialize } from "next-mdx-remote/serialize";
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";

interface Props {
  source: MDXRemoteSerializeResult;
  data: PostData;
}

interface PostData {
  title: string;
  date: string;
  spoiler: string;
}

export default function Post({ source, data }: Props) {
  return (
    <>
      <pre>{JSON.stringify(data, null, 2)}</pre>
      <MDXRemote {...source} lazy />
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: getPostAll().map((m) => ({
      params: {
        title: m.data.title,
      },
    })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params: { title } }) => {
  const { content, data } = getPostAll().find((m) => m.data.title === title);
  const mdxSource = await serialize(content);
  return {
    props: { source: mdxSource, data },
  };
};

const blogDirPath = path.join("pages", "blog");

function getPostAll() {
  return fs
    .readdirSync(blogDirPath, { withFileTypes: true })
    .filter((dirEnt) => dirEnt.isDirectory())
    .flatMap((dirEnt) => {
      const dirPath = path.join(blogDirPath, dirEnt.name);
      return fs
        .readdirSync(dirPath)
        .map((fileName) => fs.readFileSync(path.join(dirPath, fileName)));
    })
    .map((f) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { orig, ...post } = matter(f);
      return post;
    });
}