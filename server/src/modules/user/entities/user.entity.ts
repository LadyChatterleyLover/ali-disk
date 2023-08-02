import { IsNotEmpty } from 'class-validator'
import { File } from 'src/modules/file/entities/file.entity'
import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm'

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: number

  @IsNotEmpty({ message: '用户名不能为空' })
  @Column()
  username: string

  @IsNotEmpty({ message: '密码不能为空' })
  @Column()
  password: string

  @Column({ default: '' })
  nickname: string

  @Column({ default: '' })
  avatar: string

  @Column({ default: '10737418240' })
  memory: string

  @Column({ default: '10737418240' })
  remainingMemory: string

  @OneToMany(() => File, (file) => file.user)
  files: File[]

  @Column({ default: '' })
  email: string

  @Column({ default: '' })
  mobile: string

  @CreateDateColumn()
  createAt: Date

  @UpdateDateColumn()
  updateAt: Date
}
