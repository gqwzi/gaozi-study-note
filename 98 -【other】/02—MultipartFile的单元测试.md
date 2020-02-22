### MultipartFile接口有两个常用实现类，MockMultipartFile和CommonsMultipartFile。

```
MultipartFile multiFile.....
File destFile = new File("....../destFile")
//转存文件到指定的路径。
multiFile.transferTo(destFile );
```

MockMultipartFile主要用于测试
```
        File file = new File("D:\\gqwzi\\Desktop\\batchImportStar-template.xlsx");
        MultipartFile mulFile = new MockMultipartFile(
                "batchImportStar-template.xlsx", //文件名
                "batchImportStar-template.xlsx", //originalName 相当于上传文件在客户机上的文件名
                ContentType.APPLICATION_OCTET_STREAM.toString(), //文件类型
                new FileInputStream(file) //文件流
        );
```
