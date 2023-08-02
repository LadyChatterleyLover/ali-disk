import { User } from 'src/modules/user/entities/user.entity'
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm'

@Entity()
export class File {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column({ default: '' })
  ext: string

  @Column({ default: '' })
  type: string

  @Column({ default: '' })
  url: string

  @Column({ default: 0 })
  isDir: number

  @Column({ default: 0 })
  isRecovery: number

  @Column({ default: 0 })
  dirId: number

  @Column({ default: 0 })
  expirationTime: number

  @Column({ default: 0 })
  isShared: number

  @Column({ default: '' })
  shareUrl: string

  @Column({ default: 0 })
  viewCount: number

  @ManyToOne(() => User, (user) => user.files)
  user: User

  @Column({ default: 0 })
  size: number

  @Column({ default: '' })
  extractedCode: string

  @Column({ default: '' })
  deleteAt: string

  @Column({ default: '' })
  shareAt: string

  @CreateDateColumn()
  createAt: Date

  @UpdateDateColumn()
  updateAt: Date
}
