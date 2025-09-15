import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { File } from '../entities/file.entity';
import { CreateFileDto } from '../dto/create-file.dto';
import { UpdateFileDto } from '../dto/update-file.dto';

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(File)
    private filesRepository: Repository<File>,
  ) {}

  async create(createFileDto: CreateFileDto, fileInfo: any): Promise<File> {
    const file = this.filesRepository.create({
      ...createFileDto,
      filename: fileInfo.filename,
      originalFilename: fileInfo.originalname,
      filePath: fileInfo.path,
      fileType: fileInfo.mimetype,
      fileSize: fileInfo.size,
    });
    return this.filesRepository.save(file);
  }

  async findAll(page: number = 1, limit: number = 10): Promise<{ data: File[]; total: number }> {
    const [data, total] = await this.filesRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { updatedAt: 'DESC' },
    });
    return { data, total };
  }

  async findOne(id: number): Promise<File> {
    const file = await this.filesRepository.findOne({ where: { id } });
    if (!file) {
      throw new Error('File not found');
    }
    return file;
  }

  async update(id: number, updateFileDto: UpdateFileDto): Promise<File> {
    await this.filesRepository.update(id, updateFileDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const result = await this.filesRepository.delete(id);
    if (result.affected === 0) {
      throw new Error('File not found');
    }
  }

  async search(query: string): Promise<File[]> {
    return this.filesRepository
      .createQueryBuilder('file')
      .where('file.title LIKE :query OR file.description LIKE :query OR file.tags LIKE :query OR file.extractedText LIKE :query', {
        query: `%${query}%`,
      })
      .orderBy('file.updatedAt', 'DESC')
      .getMany();
  }

  async findFavorites(): Promise<File[]> {
    return this.filesRepository.find({
      where: { isFavorite: true },
      order: { updatedAt: 'DESC' },
    });
  }

  async findByType(fileType: string): Promise<File[]> {
    return this.filesRepository.find({
      where: { fileType },
      order: { updatedAt: 'DESC' },
    });
  }
}
