import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, ManyToMany, JoinTable } from "typeorm";
import { Role } from './role.entity'
import { Permission } from './permission.entity'
import { PermissionTypeEnum } from '../interface'

@Entity()
export class User {

	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	username: string;

	@Column()
	password: string;

	@Column({
		default: PermissionTypeEnum.ACL
	})
	permissionType: PermissionTypeEnum

	@CreateDateColumn()
	createTime: Date;

	@UpdateDateColumn()
	updateTime: Date;

	@ManyToMany(() => Role)
	@JoinTable({
		name: "user_role_relation"
	})
	roles: Role[]

	@ManyToMany(() => Permission)
	@JoinTable({
		name: "user_permission_relation"
	})
	permissions: Permission[]
}
