<template>
    <div class="modal">
        <div>
            <!-- 用户名 -->
            <div class="form-group">
                <label for="username">昵称</label>
                <input id="username" v-model="username" type="text" placeholder="请输入用户名" required />
            </div>
            <!-- 性别 -->
            <div class="form-group">
                <label>性别</label>
                <div class="options">
                    <label v-for="item in genderList" :key="item.gender" @click="clickGender(item.gender)"><input
                            type="radio" v-model="gender" :value="item.gender" /> {{ item.lable }}</label>
                </div>
            </div>
            <!-- 职业 -->
            <div class="form-group">
                <label>职业</label>
                <div class="profession-selector">
                    <div @click="prevProfession" class="nav-btn">《</div>

                    <div class="profession-card" v-if="currentProfession">
                        <img :src="currentProfession.image" :alt="currentProfession.name" />
                        <p>{{ currentProfession.name }}</p>
                    </div>

                    <div @click="nextProfession" class="nav-btn">》</div>
                </div>
            </div>
            <!-- 按钮 -->
            <div class="form-actions">
                <span type="submit" class="btn primary" @click="onSubmit">确定</span>
                <span type="button" class="btn secondary" @click="cancleRegister">取消</span>
            </div>
        </div>
    </div>
</template>
    
<script setup lang='ts'>
import { type ProfessionType, ProfessionKind } from "@/common/common.ts";
import { PlayerDataManager } from "@/utils/playerdata/playerDataManager";
import { onMounted } from "vue";
import { computed, ref } from 'vue';
import { useToast } from '@/utils/toast'
import { SexType } from "@/common/battle/person";
import sword_female from '@/assets/images/professions/sword_female.png'
import sword_male from '@/assets/images/professions/sword_male.png'
import talisman_female from '@/assets/images/professions/talisman_female.png'
import talisman_male from '@/assets/images/professions/talisman_male.png'
import poison_female from '@/assets/images/professions/poison_female.png'
import posion_male from '@/assets/images/professions/posion_male.png'
import medical_fairy from '@/assets/images/professions/medical_fairy.png'
import berserker from '@/assets/images/professions/berserker.png'
const emits = defineEmits<{
    (e: 'close'): void;
}>();
const toast = useToast();

const username = ref('');
const gender = ref<SexType>(SexType.MALE);

// 确认创建角色
const onSubmit = () => {
    if (!username.value) {
        toast.show('请输入昵称')
        return
    }
    PlayerDataManager.generatePlayerInfo(username.value, currentProfession.value)
    cancleRegister()
}

// 取消注册
const cancleRegister = () => {
    emits('close')
}

// 性别列表
const genderList = ref([
    {
        gender: SexType.MALE,
        lable: '男'
    },
    {
        gender: SexType.FEMALE,
        lable: '女'
    }
])
// 全部职业列表
const allProfessions = ref<ProfessionType[]>([
    { name: '剑客', type: ProfessionKind.SWORDSMAN, gender: SexType.FEMALE, image: sword_female },
    { name: '剑客', type: ProfessionKind.SWORDSMAN, gender: SexType.MALE, image: sword_male },
    { name: '符师', type: ProfessionKind.TALISMAN, gender: SexType.FEMALE, image: talisman_female },
    { name: '符师', type: ProfessionKind.TALISMAN, gender: SexType.MALE, image: talisman_male },
    { name: '毒师', type: ProfessionKind.POISONMASTER, gender: SexType.FEMALE, image: poison_female },
    { name: '毒师', type: ProfessionKind.POISONMASTER, gender: SexType.MALE, image: posion_male },
    { name: '医仙', type: ProfessionKind.MEDICALFAIRY, gender: SexType.FEMALE, image: medical_fairy },
    { name: '狂人', type: ProfessionKind.BERSERKER, gender: SexType.MALE, image: berserker },
])
// 实际展示的职业列表
const professions = ref<ProfessionType[]>([])

// 选中性别
const clickGender = (gender: string) => {
    professions.value = allProfessions.value.filter((profession) => profession.gender === gender);
}
// 当前选中的职业下标
const currentIndex = ref(0)
// 当前展示的职业
const currentProfession = computed(() => professions.value[currentIndex.value])

// 上一个职业
const prevProfession = () => {
    currentIndex.value =
        (currentIndex.value - 1 + professions.value.length) % professions.value.length
}

// 下一个职业
const nextProfession = () => {
    currentIndex.value = (currentIndex.value + 1) % professions.value.length
}

onMounted(() => {
    clickGender(SexType.MALE)
})
</script>
    
<style lang="less">
.form-group {
    margin-bottom: 1rem;

    label {
        display: block;
        margin-bottom: 0.4rem;
        color: var(--color-accent);
        font-weight: 500;
    }

    input[type="text"],
    select {
        width: 100%;
        padding: 0.5rem;
        border: 0.0625rem solid var(--border-light);
        border-radius: 0.25rem;
        background: rgba(255, 255, 255, 0.9);
        font-size: 1rem;
        color: var(--color-accent) !important;
        outline: none;
        transition: border-color 0.2s;

        &:focus {
            border-color: var(--color-main);
            box-shadow: 0 0 0.25rem rgba(92, 138, 79, 0.3);
        }
    }

    .options {
        display: flex;
        gap: 1rem;

        label {
            font-size: 0.95rem;
            color: var(--color-accent);

            input {
                margin-right: 0.3rem;
            }
        }
    }
}

.form-actions {
    text-align: center;

    .btn {
        display: inline-block;
        padding: 0.6rem 1.4rem;
        margin: 0 0.5rem;
        border: none;
        border-radius: 0.25rem;
        font-size: 1rem;
        cursor: pointer;
        transition: transform 0.1s ease, box-shadow 0.1s ease;

        &.primary {
            background: var(--color-main);
            color: #fff;
        }

        &.secondary {
            background: var(--color-accent);
            color: #fff;
        }

        &:hover {
            box-shadow: 0 0.125rem 0.375rem rgba(0, 0, 0, 0.15);
            transform: translateY(-0.0625rem);
        }

        &:active {
            transform: translateY(0.125rem);
            box-shadow: none;
        }
    }
}

.profession-selector {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.9375rem;
}

.nav-btn {
    font-size: 20px;
    background: none;
    color: #7a5c38;
    cursor: pointer;
}

.profession-card {
    width: 180px;
    text-align: center;
    transition: all 0.3s ease;
}

.profession-card img {
    width: 100%;
    border: 0.125rem solid #a8936d;
    border-radius: 0.5rem;
}

.confirm-btn {
    width: 100%;
    padding: 0.625rem 0;
    background: #c2b38b;
    border: none;
    border-radius: 0.625rem;
    font-weight: bold;
    font-size: 1.125rem;
    cursor: pointer;
}
</style>