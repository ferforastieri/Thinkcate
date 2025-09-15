import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Note } from '../entities/note.entity';
import { CreateNoteDto } from '../dto/create-note.dto';
import { UpdateNoteDto } from '../dto/update-note.dto';

@Injectable()
export class NotesService {
  constructor(
    @InjectRepository(Note)
    private notesRepository: Repository<Note>,
  ) {}

  async create(createNoteDto: CreateNoteDto): Promise<Note> {
    const note = this.notesRepository.create(createNoteDto);
    return this.notesRepository.save(note);
  }

  async findAll(page: number = 1, limit: number = 10): Promise<{ data: Note[]; total: number }> {
    const [data, total] = await this.notesRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { updatedAt: 'DESC' },
    });
    return { data, total };
  }

  async findOne(id: number): Promise<Note> {
    const note = await this.notesRepository.findOne({ where: { id } });
    if (!note) {
      throw new Error('Note not found');
    }
    return note;
  }

  async update(id: number, updateNoteDto: UpdateNoteDto): Promise<Note> {
    await this.notesRepository.update(id, updateNoteDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const result = await this.notesRepository.delete(id);
    if (result.affected === 0) {
      throw new Error('Note not found');
    }
  }

  async search(query: string): Promise<Note[]> {
    return this.notesRepository
      .createQueryBuilder('note')
      .where('note.title LIKE :query OR note.content LIKE :query OR note.tags LIKE :query', {
        query: `%${query}%`,
      })
      .orderBy('note.updatedAt', 'DESC')
      .getMany();
  }

  async findFavorites(): Promise<Note[]> {
    return this.notesRepository.find({
      where: { isFavorite: true },
      order: { updatedAt: 'DESC' },
    });
  }
}
