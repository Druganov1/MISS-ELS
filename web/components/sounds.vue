<template>
  <div class="flex flex-col justify-center h-full">
    <header class="px-5 pt-3 flex items-center">
      <h2 class="mr-4">Sounds</h2>

      <label for="useServerSirens" class="cb-label">
        <input
          class="mr-2"
          id="useServerSirens"
          v-model="VCF.configuration.useServerSirens"
          type="checkbox"
        />
        Use&nbsp;
        <a
          class="underline flex items-center"
          href="https://github.com/Walsheyy/WMServerSirens"
          target="_blank"
          >WMServerSirens <ArrowTopRightOnSquareIcon class=" ml-2 w-4 h-auto" /></a
        >
      </label>
    </header>

    <div class="p-3 overflow-x-auto">
      <table class="table-auto w-full">
        <thead class="text-xs font-semibold uppercase text-gray-400 bg-gray-50">
          <tr>
            <th>Option</th>
            <th>Allow use</th>
            <th>Audio string</th>
            <th v-if="VCF.configuration.useServerSirens">Soundset</th>
          </tr>
        </thead>

        <tbody class="text-sm divide-y divide-gray-100">
          <tr v-for="(option, index) in VCF.configuration.sounds" :key="index">
            <td class="font-bold">
              {{ option.name }}
            </td>
            <td>
              <label :for="`allowUse[${index}]`" class="cb-label">
                <input
                  :id="`allowUse[${index}]`"
                  v-model="option.allowUse"
                  type="checkbox"
                />
              </label>
            </td>
            <td>
              <input
                v-if="option.allowUse && option['audioString'] !== undefined"
                v-model="option.audioString"
                type="text"
              />
            </td>
            <td v-if="option.allowUse && VCF.configuration.useServerSirens">
              <input
                v-if="option['soundSet'] !== undefined"
                v-model="option.soundSet"
                type="text"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ArrowTopRightOnSquareIcon } from "@heroicons/vue/24/solid";
import {defaultVcfConfig} from "~/composables/vcfConfiguration";

const VCF = useVcfConfiguration();

// Added all strings, so we can easily add more siren options, without having to change the code.
const natoAlphabet = [
  'ALPHA',
  'BRAVO',
  'CHARLIE',
  'DELTA',
  'ECHO',
  'FOXTROT',
  'GOLF',
  'HOTEL',
  'INDIA',
  'JULIETT',
  'KILO',
  'LIMA',
  'MIKE',
  'NOVEMBER',
  'OSCAR',
  'PAPA',
  'QUEBEC',
  'ROMEO',
  'SIERRA',
  'TANGO',
  'UNIFORM',
  'VICTOR',
  'WHISKEY',
  'X-RAY',
  'YANKEE',
  'ZULU'
]

// Watch for changes in the useServerSirens checkbox, and update the audioString to the NATO alphabet.
watch(
    () => VCF.value.configuration.useServerSirens,
    () => {
      if (VCF.value.configuration.useServerSirens) {
        let iterations = 0
        VCF.value.configuration.sounds.forEach((sound) => {
          if (!['MainHorn', 'NineMode'].includes(sound.name)) {
            sound.audioString = `SIREN_${natoAlphabet[iterations]}`;
            iterations++;
          }
        })
      } else {
        VCF.value.configuration.sounds.forEach((sound) => {
          if (!['MainHorn', 'NineMode'].includes(sound.name)) {
            sound.audioString = defaultVcfConfig().configuration.sounds.find((defaultSound) => defaultSound.name === sound.name).audioString;
          }
        })
      }
    }
)
</script>
